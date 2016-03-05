
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

    Meteor.call('renameList', prevListName, newListName, function (error, result) {
        if (error){
            console.log("ERROR: ", error.toString());
            Bert.alert(error.toString, 'danger', 'growl-top-right' );
        }
        else{
            // Print result to console and popup the summary to UI (1st line)
            console.log("Result:", result);
            if (result.startsWith("SUCCESS")){
                Bert.alert(result, 'success', 'growl-top-right' ); 
                Session.set("listName", newListName);
            }
        }
    });
}
