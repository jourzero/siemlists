
// Save the list data
function saveListDataFromUI() {
    var listName = Session.get("listName");
    if ((listName === undefined) || (listName === "")){
        console.log("Empty List Name");
        return;
    }        

    var lst = {}, idx = {}, mod={};
    idx.name       = listName;
    lst.name       = listName;
    lst.purpose    = $("#ListPurpose").val();
    lst.srcType    = $("#SrcTypeSel option:selected" ).val();
    lst.uri        = $("#Uri").val();
    lst.parsingRule= $("#ParsingRule").val();
    lst.listType   = $("#ListTypeSel option:selected" ).val();
    lst.entityType = $("#EntTypeSel option:selected" ).val();
    //lst.entityID   = $("#EntityID").val();
    lst.entityList = $("#EntityList").val();

    mod["$set"] = lst;
    i = listsColl.findOne(idx);

    // If the issue doesn't exist, insert a new record. If not, use upsert.
    if ((i === undefined) || (i._id <= 0)){
        console.log("Inserting a new list " + listName);
        newId = listsColl.insert(lst);
    }
    else{
        console.log("Updating data for list " + listName + ". ID: " + i._id);
        updId = listsColl.upsert(i._id, mod);
    }
}


// Rename the list
function renameListFromUI(prevListName, newListName) {
    if ((prevListName === undefined) || (prevListName === "")){
        console.log("Skipping rename, previous name is empty");
        return;
    }        
    if ((newListName === undefined)  || (newListName === "")){
        console.log("Skipping rename, new name is empty");
        return;
    }        
    
    var vals = {}, critPrev = {}, critNew = {}; mod={};
    critPrev.name  = prevListName;
    critNew.name   = newListName;
    vals.name      = newListName;
    mod["$set"] = vals;
    rec1 = listsColl.findOne(critPrev);
    rec2 = listsColl.findOne(critNew);

    // Skip if the list record to be renamed doesn't exist
    if ((rec1 === undefined) || (rec1._id <= 0)){
        console.log("Previous list not found: " + prevListName);
        return;
    }
    
    // Skip if there's already a record with the new name
    if (rec2 !== undefined){
        console.log("ERROR: The list " + prevListName + " cannot be renamed because " + newListName + " already exists.");
        return;
    }
    
    // Rename the list
    console.log("Renaming list from " + prevListName + " to " + newListName);
    updId = listsColl.update(rec1._id, mod);
    Session.set("listName", newListName);
}
