//Meteor.startup(function () {

  // Use Validator (https://www.npmjs.com/package/validator)
  var validator = Meteor.npmRequire('validator');
 
  Meteor.methods({
    validate: function (listName) {          
        console.log("Validating list", listName);

        // Build search criteria
        var lst = {}, idx = {}, mod={};
        idx.name = listName;
        lst.name = listName;
        mod["$set"] = lst;
        l = listsColl.findOne(idx);

        // If the list exists, get the data
        if ((l === undefined) || (l._id <= 0)){
            console.log("No data found for list " + listName);
            return "No data found for list " + listName;
        }        

        // Get values from record
        //var srcType = l.srcType;
        var listType = l.listType;
        var entType  = l.entityType;
        var listData = l.entityList;
        var typeA    = null;
        var typeB    = null;
        var valFunc  = null;

        // Adjust processing based on Entity Type
        switch(entType){
            case 'ip':       typeA = "IPAddress";    valFunc = validator.isIP  ;        break;
            case 'fqdn':     typeA = "HostName";     valFunc = validator.isFQDN;        break;
            case 'domain':   typeA = "DomainName ";  valFunc = validator.isFQDN;        break;
            case 'mac':      typeA = "MACAddress";   valFunc = validator.isMACAddress ; break;
            case 'account':  typeA = "Credentials";  valFunc = validator.isAscii;       break;
            case 'catchall': typeA = null;           valFunc = validator.isAscii;       break;
            case 'eventfwd': typeA = null;           valFunc = validator.isAscii;       break;
            case 'text':     typeA = null;           valFunc = validator.isAscii;       break;
            case 'jsonb64':  typeA = null;           valFunc = validator.isJSON;       break;
        }
        
        // Adjust processing based on List Type
        switch(listType){
            case 'BL':      typeB = "BlackList";           break;
            case 'WL':      typeB = "WhiteList";           break;
            case 'DBL':     typeB = "DeviceBlackList";     break;
            case 'DWL':     typeB = "DeviceWhiteList";     break;
            case 'DM':      typeB = "DeviceManufacturer";  break;
            case 'CONF':    typeB = null;                   break;
            case 'TEXT':    typeB = null;                   break;
            case 'HBRD':    typeB = null;                   break;
        }
        
        // Check if the data is multiline JSON. If it is, validate the whole thing at once.
        if (entType === 'jsonb64'){
            
            // Run 1st level test for JSON data
            if (valFunc(listData)){
                
                // Run 2nd level test for JSON data
                var data = {};
                try{
                    data = JSON.parse(listData);
                }catch(e){
                    return "FAIL! 2nd level JSON data validation did not pass. Exception: " + e.toString();
                }   
                
                // If the list type is HBase Ref Data, it's Base-64 encoded. Try decoding it.
                if (listType === 'HBRD'){
                    base64decoded = "";
                    for (var i=0; i<data.Row.length; i++){
                        var key = new Buffer(data.Row[i].key, 'base64').toString("ascii");
                        //console.log("Row[",i,"].key=", key);
                        for (var j=0; j<data.Row[i].Cell.length; j++){
                            var col = new Buffer(data.Row[i].Cell[j].column, 'base64').toString("ascii");
                            var val = new Buffer(data.Row[i].Cell[j]['$'], 'base64').toString("ascii");
                            var ts  = data.Row[i].Cell[j].timestamp;
                            decoded = "Row[" + i + "].key=" + key + ": column=" + col + "; $=" + val + "; timestamp=" + ts + "\n";
                            console.log(decoded); 
                            base64decoded += decoded;
                        }
                    }
                    return "PASS. JSON-Base64 validation OK.\n" + base64decoded;
                }
                else{
                    return "PASS. Both levels of JSON validation passed.";
                }
            }
            else{
                return "FAIL! 1st level JSON data validation did not pass.";
            }
        }
        
        // Check if the data is multiline text. If it is, validate the whole thing at once.
        else if (entType === 'text'){
            if (valFunc(listData))
                return "PASS. Text validation OK.";
            else
                return "FAIL!";
        }
        
        // At this point, the data should be line-by-line, so we validate each line, one by one.
        else{
            var list     = listData.split("\n");
            var failNums="", failList="";
            for(i=0; i<list.length; i++){
                if (list[i] === undefined){
                    console.log("ERROR: Could not extract the entity data from line #", i)
                    failNums += String(i+1) + " ";
                    failList += "undef" + " ";
                    continue;
                }
                
                // If the list is Device Manufacturers, use a custom mapping extractor and validator
                if (listType === 'DM'){
                    var vals1= list[i].split(" ");
                    var mac = vals1[0];
                    var vals2= list[i].split("\t");
                    var manuf = vals2[2];
                    if (manuf === undefined){
                        failNums += String(i+1) + " ";
                        failList += "[" + String(i+1) + "] " + list[i] + "\n";
                    }
                }
                
                // Use Validator and save failure data in buffer
                else{
                    if (!valFunc(list[i])){
                        failNums += String(i+1) + " ";
                        failList += "[" + String(i+1) + "] " + list[i] + "\n";
                    }
                }
            }
            if (failList === "")
                return "PASS. Checked all " + String(list.length) + " entries.";
            else{
                var msg = "FAIL! Please review line number(s): " + failNums;
                return msg  + ".\nFailed lines:\n" + failList;
            }
        }
        
        // Code should never get here. If it does, return a warning message.
        return "WARNING: Validation for this list is not supported.";
    }
  });
//});
