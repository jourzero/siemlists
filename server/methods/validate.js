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
      var valFunc  = null;

      // Adjust validation based on Entity Type
      // Validator functions: https://www.npmjs.com/package/validator
      switch(entType){
          case 'ip':       valFunc = validator.isIP  ;        break;
          case 'fqdn':     valFunc = validator.isFQDN;        break;
          case 'domain':   valFunc = validator.isFQDN;        break;
          case 'mac':      valFunc = validator.isMACAddress ; break;
          case 'account':  valFunc = validator.isAscii;       break;
          case 'catchall': valFunc = validator.isAscii;       break;
          case 'eventfwd': valFunc = validator.isAscii;       break;
          case 'text':     valFunc = validator.isAscii;       break;
          case 'csv':      valFunc = validator.isAscii;       break;
          case 'jsonb64':  valFunc = validator.isJSON;       break;
      }
      
      // Validate JSON/Base64 data (from HBase REST) with a multi-level validator
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
              if (listType === 'HBRD')
                  return validateJsonBase64(data);
              else
                  return "PASS. Both levels of JSON validation passed.";
          }
          else
              return "FAIL! 1st level JSON data validation did not pass.";
      }

      // Check if the data is multiline text. If it is, validate the whole thing at once.
      else if (entType === 'text'){
          if (valFunc(listData))
              return "PASS. Text validation OK.";
          else
              return "FAIL! Plain text validation did not pass.";
      }

      // Check if the data is for Event Forwarding. If it is, call its special validator function.
      else if (entType === 'eventfwd'){
          if (valFunc(listData))
              //return "PASS. Text validation OK.";
              return validateEventFwd(listData);
          else
              return "FAIL! Plain text validation did not pass.";
      }

      // Check if the data is for Catchall Config. If it is, call its special validator function.
      else if (entType === 'catchall'){
          if (valFunc(listData))
              return validateCatchallConfig(listData);
          else
              return "FAIL! Plain text validation did not pass.";
      }

      // Check if the data is CSV. If it is, call its special validator function.
      else if (entType === 'csv'){
          if (valFunc(listData))
              return validateCsvData(listData);
          else
              return "FAIL! Plain text validation did not pass.";
      }

      // At this point, the data should be line-by-line, so we validate each line, one by one.
      // We use the specified validator in the above switch/case statements.
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


/*
 * Validate JsonBase64 data
 * @return PASS/FAIL string with reason text 
 */
function validateJsonBase64(data){
    base64decoded = "";
    try{
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
    } catch(e){
         return "FAIL! Data validation did not pass Base64 check. Exception: " + e.toString();
    }                   
}


/*
 * Validate Event Forwarding data
 * @return PASS/FAIL string with reason text 
 */
function validateEventFwd(data){
    try{
        // Process each CSV line
        var csvLines = data.split("\n");
        if (csvLines === undefined)
            return "FAIL! Data validation for EventFwd did not pass the initial line splitting.";
        for (var i=0; i<csvLines.length; i++){
            
            // Skip line comment lines starting with "#"
            if (csvLines[i].startsWith("#"))
                continue;

            // Split the line into CSV records
            var csv = csvLines[i].split(","); 
            if (csv === undefined)
                return "FAIL! Data validation for EventFwd did not pass CSV splitting at line #" + String(i+1);

            // Check the number of CSV records
            if (csv.length < 4)
                return "FAIL! Invalid number of CSV records at line #" + String(i+1);

            // Add the short name
            var domain   = csv[0];
            var confType = csv[1];
            var srcHost  = csv[2];
            var hdfsPath = csv[3];
            
            if (!validator.isAscii(domain) || domain.length<=0)
                return "FAIL! Domain value failed at line #" + String(i+1) + ".\nData: " + domain; 
            
            if (!validator.isAscii(confType) || confType.length<=0)
                return "FAIL! ConfigType value failed at line #" + String(i+1) + ".\nData: " + confType;
            
            if (!validator.isAscii(srcHost) || srcHost.length<=0)
                return "FAIL! SourceHost value failed at line #" + String(i+1) + ".\nData: " + srcHost; 
            
            if (!validator.isAscii(hdfsPath) || hdfsPath.length<=0)
                return "FAIL! HdfsPath value failed at line #" + String(i+1) + ".\nData: " + hdfsPath;                
        }
        return "PASS. event forwarding config values look OK."
    } catch(e){
         return "FAIL! Data validation did not pass EventFwd check. Exception: " + e.toString();
    }                   
    
}


/*
 * Validate Catchall Config data
 * @return PASS/FAIL string with reason text 
 */
function validateCatchallConfig(data){
    try{
        // Process each CSV line
        var csvLines = data.split("\n");
        if (csvLines === undefined)
            return "FAIL! Data validation for Catchall config did not pass the initial line splitting.";
        for (var i=0; i<csvLines.length; i++){
            
            // Skip line comment lines starting with "#"
            if (csvLines[i].startsWith("#"))
                continue;

            // Split the line into CSV records
            var csv = csvLines[i].split(","); 
            if (csv === undefined)
                return "FAIL! Data validation for Catchall config did not pass CSV splitting at line #" + String(i+1);

            // Check the number of CSV records
            if (csv.length < 4)
                return "FAIL! Invalid number of CSV records at line #" + String(i+1);

            // Add the short name
            var grpName   = csv[0];
            var shortName = csv[1];
            var fqdn      = csv[2];
            var ipAddr    = csv[3];
            
            if (!validator.isAscii(grpName) || grpName.length<=0)
                return "FAIL! GROUP_NAME value failed at line #" + String(i+1) + ".\nData: " + grpName; 
            
            if (!validator.isAscii(shortName) || shortName.length<=0)
                return "FAIL! SHORT_NAME value failed at line #" + String(i+1) + ".\nData: " + shortName;            
            
            if (!validator.isAscii(fqdn) || fqdn.length<=0)
                return "FAIL! FQDN value failed at line #" + String(i+1) + ".\nData: " + fqdn;            
            
            if (!validator.isAscii(ipAddr) || ipAddr.length<=0)
                return "FAIL! IP_ADDRESS value failed at line #" + String(i+1) + ".\nData: " + ipAddr;            
        }
        return "PASS. All Catchall config values look OK."
    } catch(e){
         return "FAIL! Data validation did not pass Catchall config check. Exception: " + e.toString();
    }                   
    
}



/*
 * Validate CSV data
 * @return PASS/FAIL string with reason text 
 */
function validateCsvData(data){
    try{
        // Process each CSV line
        var csvLines = data.split("\n");
        var numCols  = 0;
        
        if (csvLines === undefined)
            return "FAIL! Data validation for CSV data did not pass the initial line splitting.";
        for (var i=0; i<csvLines.length; i++){
            
            // Skip line comment lines starting with "#"
            if (csvLines[i].startsWith("#"))
                continue;

            // Split the line into CSV records
            var csv = csvLines[i].split(","); 
            if (csv === undefined)
                return "FAIL! Validation for CSV data did not pass CSV splitting at line #" + String(i+1);
            
            // Use the first line to determine the number of columns expected
            if (numCols <= 0)
                numCols = csv.length;

            // Check the number of CSV records
            if (csv.length != numCols)
               return "FAIL! Invalid number of CSV columns at line #" + String(i+1) + ".\nData: " + csvLines[i];

            // Check the CSV values
            for (j=0; j<csv.length; j++){
                var val = csv[j];
                if (!validator.isAscii(val) || val.length<=0)
                    return "FAIL! CSV value check failed at line #" + String(i+1) + ", col#" + String (j+1) + ".\nData: " + val[j]; 
            }
        }
        return "PASS. All CSV values look OK."
    } catch(e){
         return "FAIL! Data validation did not pass CSV check. Exception: " + e.toString();
    }                   
    
}