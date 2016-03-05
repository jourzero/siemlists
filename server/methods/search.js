// Use Validator (https://www.npmjs.com/package/validator)
var validator = Meteor.npmRequire('validator');

Meteor.methods({
  search: function (srcType, entType, entName, mappingType, searchFilter) {
      var searchCombo = "SourceType=" + srcType + "; EntityType=" + entType + "; EntityName=" + entName + "; MappingType=" + mappingType + "; SearchFilter=" + searchFilter;
      //console.log("Searching with combination:", searchCombo);

      // Validate inputs
      // Validator functions: https://www.npmjs.com/package/validator
      var valFunc = undefined;
      switch(entType){
          case 'email':    valFunc = validator.isEmail;         break;
          case 'ip':       valFunc = validator.isIP;            break;
          case 'fqdn':     valFunc = validator.isFQDN;          break;
          case 'domain':   valFunc = validator.isFQDN;          break;
          //case 'mac':      valFunc = validator.isMACAddress;  break;
          case 'mac':      valFunc = validator.isAlphanumeric;  break;
          case 'account':  valFunc = validator.isAscii;         break;
          case 'url':      valFunc = validator.isURL;           break;
          case 'list':     valFunc = dontCare;                  break;
          default:
              return "FAIL: Entity Type value is not supported yet (or invalid).\nEntityType=" + entType
      }
      switch(srcType){
          case 'Mongo':     break;
          case 'EntityMap': break;
          default:
              return "FAIL: Source Type value is not supported yet (or invalid).\nSourceType=" + srcType
      }
      switch(mappingType){
          case 'email':     break;
          case 'ip':        break;
          case 'fqdn':      break;
          case 'domain':    break;
          case 'mac':       break;
          case 'account':   break;
          case 'BL':        break;
          case 'WL':        break;
          case 'DBL':       break;
          case 'DWL':       break;
          case 'DM':        break;
          case 'HBRD':      break;
          default:
              return "FAIL: Mapping Type value is not supported yet (or invalid).\nMappingType=" + mappingType;
      }
            
      // Validate the entity name
      if (valFunc !== undefined){
          if (valFunc(entName)){
            if (srcType === "Mongo"){
                return searchMongo(srcType, entType, entName, mappingType, searchFilter);
            }
            else if (srcType === "EntityMap"){
                // Check that the entity name is not empty
                if ((entName===undefined) || (entName==="")){
                    return "FAIL: Entity Name is empty.";
                }
                return searchHBase(srcType, entType, entName, mappingType, searchFilter);            
            }
            else{
                return "FAIL: Invalid Source Type.\nSourcType=" + srcType;
            }
          }
          else{
              return "FAIL: Validator did not pass.\nEntityName=" + entName + "\nEntityType=" + entType;
          }
      }

      // If the code gets here, the search combination is not supported yet
      return "WARNING: This search combination is not supported yet.\n" + searchCombo;
  }
});


/*
 * Search MongoDB
 * @return SUCCESS/FAIL string with reason text (first line) with the data (lines 2+)
 */
function searchMongo(srcType, entType, entName, mappingType, searchFilter){
    
    var searchCombo = "EntityType=" + entType + "; EntityName=" + entName + "; MappingType=" + mappingType + "; SearchFilter=" + searchFilter; 
    
    // Build search criteria
    var crit = {}, regex = {};
    if ((entName!==undefined) && (entName!=="")){
        crit.name       = entName;
    }
    if ((searchFilter!==undefined) && (searchFilter!=="")){
        regex["$regex"] = searchFilter;
        crit.entityList = regex
    }
    crit.listType   = mappingType;
    console.log("Searching MongoDB with db.siemlists.find(" + JSON.stringify(crit) + ")");
    
    // Search for the matching records
    var cur = listsColl.find(crit);
    if (cur === undefined){
        return "WARNING: MongoDB search didn't return any result."
    }

    // Get and format the data
    var header = toCsvVal("name") + toCsvVal("purpose") + toCsvVal("srcType") + toCsvVal("uri") + toCsvVal("listType") + toCsvVal("entityType") + toCsvVal("entityList",1) + "\n";
    var data = "";
    cur.forEach(function (rec) {
        data += toCsvVal(rec.name) + toCsvVal(rec.purpose) + toCsvVal(rec.srcType) + toCsvVal(rec.uri) + toCsvVal(rec.listType) + toCsvVal(rec.entityType) + toCsvVal(rec.entityList,1) + "\n";
    });

    // Return a status message and the data
    if ((data===undefined)||(data==="[]"))
        return "WARNING: MongoDB search didn't return any result."
    else
        return "SUCCESS: MongoDB search was executed successfully. See Matches for results.\n" + header + data;
}


/*
 * Search HBase for mapping
 * @return SUCCESS/FAIL string with reason text (first line) with the data (lines 2+)
 */
function searchHBase(srcType, entType, entName, mappingType, searchFilter){
    
    var searchCombo = "EntityType=" + entType + "; EntityName=" + entName + "; MappingType=" + mappingType + "; SearchFilter=" + searchFilter; 
    
    // Build search criteria
    var crit = {}, regex = {};
    regex["$regex"] = searchFilter;
    crit.name       = entName;
    crit.entityList = regex
    crit.listType   = mappingType;
    console.log("Searching MongoDB with db.siemlists.find(" + JSON.stringify(crit) + ")");
    
    // Search for the matching records
    var cur = listsColl.find(crit);
    if (cur === undefined){
        return "WARNING: MongoDB search didn't return any result."
    }

    // Get and format the data
    var header = toCsvVal("name") + toCsvVal("purpose") + toCsvVal("srcType") + toCsvVal("uri") + toCsvVal("listType") + toCsvVal("entityType") + toCsvVal("entityList",1) + "\n";
    var data = "";
    cur.forEach(function (rec) {
        data += toCsvVal(rec.name) + toCsvVal(rec.purpose) + toCsvVal(rec.srcType) + toCsvVal(rec.uri) + toCsvVal(rec.listType) + toCsvVal(rec.entityType) + toCsvVal(rec.entityList,1) + "\n";
    });

    // Return a status message and the data
    if ((data===undefined)||(data==="[]"))
        return "WARNING: MongoDB search didn't return any result."
    else
        return "SUCCESS: MongoDB search was executed successfully. See Matches for results.\n" + header + data;
}


// Convert a value to CSV, adding surrounding quotes and comma if not the last record.
function toCsvVal(s, last){
    var comma = ",";
    s = s.replace(/\n/g, '|')
    s = s.replace(/"/g, '""')
    s = '"' + s + '"';
    if (last !== undefined)
        comma = "";
    return s + comma;
}

function dontCare(){
    return true;
}