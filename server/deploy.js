Meteor.startup(function () {

  // Use Validator (https://www.npmjs.com/package/validator)
  var validator = Meteor.npmRequire('validator');
 
  Meteor.methods({
    deploy: function (listName) {          
        console.log("Deploying list", listName);

        // Build search criteria
        var lst = {}, idx = {}, mod={};
        idx.name = listName;
        lst.name = listName;
        mod["$set"] = lst;
        //console.log("Checking if entry exists for list " + listName);
        l = listsColl.findOne(idx);

        // If the list exists, get the data
        if ((l === undefined) || (l._id <= 0)){
            console.log("No data found for list " + listName);
            return;
        }        

        // Get values from record
        //var srcType = l.srcType;
        var listType = l.listType;
        var entType  = l.entityType;
        var listData = l.entityList;
        var list     = listData.split("\n");
        
        var typeA    = null;
        var typeB    = null;
        var valFunc  = null;

        switch(entType){
            case 'ip':       typeA = "IP Address";   valFunc = validator.isIP  ;        break;
            case 'fqdn':     typeA = "Host Name";    valFunc = validator.isFQDN;        break;
            case 'domain':   typeA = "Domain Name "; valFunc = validator.isFQDN;        break;
            case 'mac':      typeA = "MAC Address";  valFunc = validator.isMACAddress ; break;
            case 'account':  typeA = "Credentials";  valFunc = validator.isAscii;       break;
            case 'catchall': typeA = null;           valFunc = validator.isAscii;       break;
            case 'eventfwd': typeA = null;           valFunc = validator.isAscii;       break;
        }
        

        switch(listType){
            case 'BL':      typeB = "Black List";           break;
            case 'WL':      typeB = "White List";           break;
            case 'DBL':     typeB = "Device Black List";    break;
            case 'DWL':     typeB = "Device White List";    break;
            case 'DM':      typeB = "Device Manufacturer";  break;
            case 'CONF':    typeB = null;                   break;
        }

        if ((typeA !== null) && (typeB !== null)){
            for(i=0; i<list.length; i++){
                if (list[i] === undefined){
                    console.log("ERROR: Could not extract the entity data from line #", i)
                    continue;
                }
                // If the list is Device Manufacturers, use a custom mapping extractor and validator
                if (listType === 'DM'){
                    var vals1= list[i].split(" ");
                    var mac = vals1[0];
                    var vals2= list[i].split("\t");
                    var manuf = vals2[2];
                    if (manuf === undefined){
                        console.log("ERROR: Could not extract the manufacturer name.")
                        continue;
                    }
                    else
                        console.log("Creating mapping with TypeA =", typeA, "and TypeB =", typeB, "for entity", manuf, "with MAC", mac);                    
                }
                // Use Validator and deploy if valid
                else{
                    if (valFunc(list[i]))
                        console.log("Creating mapping with TypeA =", typeA, "and TypeB =", typeB, "for entity", list[i]);
                    else{
                        console.log("Invalid value for entity",list[i], "of type", entType);
                        continue;
                    }
                }
            }
        }
        console.log("Deployment complete.");

    }
  });
});
