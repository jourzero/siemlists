HBASE_REST_URL="http://127.0.0.1:55555";
TXTFILE_BASE="/var/tmp";

  // Use Validator (https://www.npmjs.com/package/validator)
  var validator = Meteor.npmRequire('validator');
  var fs        = Meteor.npmRequire('fs');
 
  Meteor.methods({
    deploy: function (listName) {
        
        // First validate the list
        console.log("Validating list", listName, "before deployment");
        try{
            result = Meteor.call('validate', listName);
        }catch(e){
            console.log("ERROR: Call to validate() failed. Exception data:", e);
            return "ERROR: Call to validate() failed. Exception: " + e.toString();
        }   
        
        lines = result.split("\n");
        var summary = lines[0];
        console.log("Validation result", summary);
        if (!summary.startsWith("PASS"))
            return "ERROR: Could not deploy list" + listName + ", validation failed.\n" + result; 
        

        // Proceed if validation passed
        console.log("User", Meteor.user().username, "invoked deployment for list", listName);

        // Build search criteria
        var lst = {}, idx = {}, mod={};
        idx.name = listName;
        lst.name = listName;
        mod["$set"] = lst;
        //console.log("Checking if entry exists for list " + listName);
        l = listsColl.findOne(idx);

        // If the list exists, get the data
        if ((l === undefined) || (l._id <= 0)){
            msg = "ERROR: No data found for list " + listName;
            console.log(msg);
            return msg;
        }        

        // Get values from record
        //var srcType = l.srcType;
        var listType = l.listType;
        var entType  = l.entityType;
        var listData = l.entityList;
        var list     = listData.split("\n");

        // Setup some variables to simplify processing
        var typeA    = null;
        var typeB    = null;
        var valFunc  = null;
        switch(entType){
            case 'ip':       typeA = "IPAddress";    valFunc = validator.isIP  ;        break;
            case 'fqdn':     typeA = "HostName";     valFunc = validator.isFQDN;        break;
            case 'domain':   typeA = "DomainName ";  valFunc = validator.isFQDN;        break;
            case 'mac':      typeA = "MACAddress";   valFunc = validator.isMACAddress ; break;
            case 'account':  typeA = "Credentials";  valFunc = validator.isAscii;       break;
            case 'catchall': typeA = null;           valFunc = validator.isAscii;       break;
            case 'eventfwd': typeA = null;           valFunc = validator.isAscii;       break;
            case 'text':     typeA = null;           valFunc = validator.isAscii;       break;
            case 'jsonb64':  typeA = null;           valFunc = validator.isJSON;        break;                 
        }        
        switch(listType){
            case 'BL':      typeB = "BlackList";            break;
            case 'WL':      typeB = "WhiteList";            break;
            case 'DBL':     typeB = "DeviceBlackList";      break;
            case 'DWL':     typeB = "DeviceWhiteList";      break;
            case 'DM':      typeB = "DeviceManufacturer";   break;
            case 'CONF':    typeB = null;                   break;
            case 'TEXT':    typeB = null;                   break;
            case 'HBRD':    typeB = null;                   break;
        }

        // If it's a catchall config, generate YAML output
        if ((listType === 'CONF') && (entType === 'catchall')){
            var fileName = TXTFILE_BASE + "/" + listType + "_" + entType + ".yaml";
            try{ // TODO: Fix this try/catch because it doesn't work
                var yamlText = genYaml(listData);
                fs.writeFile(fileName, yamlText);
            }
            catch(e){
                msg = 'ERROR: Could not save to file ' + fileName + ". Exception details: " + e.toString();
                console.log(msg);
                return msg;            
            }
            msg = "SUCCESS: File saved. Path: " + fileName + "\nYAML Content:\n" + yamlText;
            console.log(msg);
            return msg;            
        }

        if ((listType === 'CONF') || (listType === 'TEXT')){
            var fileName = TXTFILE_BASE + "/" + listType + "_" + entType + ".txt";
            try{
                fs.writeFile(fileName, listData);
            }
            catch(e){
                msg = 'ERROR: Could not save to file ' + fileName + ". Exception details: " + e.toString();
                console.log(msg);
                return msg;            
            }
            msg = "SUCCESS: File saved. Path: " + fileName;
            console.log(msg);
            return msg;            
        }

        if (((typeA !== null) && (typeB !== null)) || ((entType === "jsonb64") && (listType === "HBRD"))){
            var errorCount=0;
            var rows = [];
            var d = new Date();
            var ts = d.getTime();

            for(i=0; i<list.length; i++){
                if (list[i] === undefined){
                    console.log("ERROR: Could not extract the entity data from line #", i+1)
                    continue;
                }
                // If the list is Device Manufacturers, use a custom mapping extractor
                if (listType === 'DM'){
                    var vals1= list[i].split(" ");
                    var mac = vals1[0];
                    var vals2= list[i].split("\t");
                    var manuf = vals2[2];
                    if (manuf === undefined){
                        errorCount++;
                        console.log("ERROR: Could not extract the manufacturer name.")
                        continue;
                    }
                    else{
                        console.log("SIMULATION: Creating mapping with TypeA =", typeA, "and TypeB =", typeB, "for entity", manuf, "with MAC", mac);                    
                    }
                }
                // Otherwise, build a JSON object for a standard mapping
                else{
                    // Add a cell to the JSON object
                    console.log("Creating a JSON cell for entity", list[i]);
                    var tableName = "siemlists_" + listType + "_" + entType;
                    var rowKey    = list[i];
                    var rowKeyB64 = Buffer(rowKey).toString('base64');
                    var colB64    = Buffer("parsed:sessions").toString('base64');
                    var valB64   = Buffer(list[i]).toString('base64');
                    var entry = {
                            "key": rowKeyB64,
                            "Cell": [{ "column" : colB64, "timestamp" : ts,  "$" : valB64 }]
                        };
                    rows.push(entry);
                }
            } // Done building the JSON object
            
            // Build the POST request
            var options = {};
            var reqOpt  = {};
            var uri = HBASE_REST_URL + "/" + tableName + "/falserowkey";
            var obj = { "Row" : rows };

            if (proxyURL.length > 0)
                reqOpt.proxy = proxyURL;
            reqOpt.headers = { "Content-Type" : "application/json", 'Accept': 'application/json' };
            options.npmRequestOptions = reqOpt;
            options.data = obj;
            console.log("Sending HTTP POST to", uri, "... (SIMULATION)");
            console.log("JSON data sent: ", JSON.stringify(obj));
            try{
                // Python equivalent:
                //request = requests.post(uri, data=json.dumps(jsonOutput), headers={"Content-Type" : "application/json", "Accept" : "application/json"});
                var result = Meteor.http.post(uri, options);
            }catch(e){
                errorCount++;
                msg = "ERROR: HTTP POST failed. Exception: " + e.toString();
                console.log(msg);
                return msg;
            }                           
            msg = "SUCCESS: Deployment complete.";
            console.log(msg);
            return msg;
        } 
        else{
            msg = "WARNING: Deployment for this list type or entity type is not supported.";
            console.log(msg);
            return msg;
        }
        msg = "WARNING: Deployment for this list/entity type is not supported."
        console.log(msg);
        return msg;
    }
  });
//});


// Extract the CSV entries and format them as YAML
function genYaml(csvText){
    var yaml = "%YAML 1.2\n---\n\nsources:\n";
    var aliases = "";

    // Process each CSV line
    var csvLines = csvText.split("\n");
    if (csvLines === undefined)
        return yaml;
    
    for (var i=0; i<csvLines.length; i++){
        
        // Skip line comment lines starting with "#"
        if (csvLines[i].startsWith("#")){
            continue;
        }
            
        var csv = csvLines[i].split(","); 
        if (csv === undefined)
            return yaml;

        // If the csvText doesn't have group name and short name, generate an empty YAML file
        if (csv.length < 2){
            return yaml;
        }

        // Add the short name
        yaml += "  " + csv[1] + ":\n";
        
        // If there is/are alias(es), add it(them)
        for (var j=2; j<csv.length; j++){
            if (aliases.length > 0)
                aliases += ",";
            aliases += csv[j];
        }
        if (aliases.length > 0)
            yaml += "    alias [" + aliases + "]\n";
        
        // Add the parser name (group name)
        yaml += "    user_parsers:[" + csv[0] + "]\n\n";
    }
    return yaml;
}