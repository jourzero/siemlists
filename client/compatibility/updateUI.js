// Update UI when list name changes
function updateUIFromListName() {

    // Get list name from UI and make sure it's not empty
    var listName = Session.get("listName");        
    if ((listName === undefined) || (listName === "")){
        console.log("Empty List Name");
        return;
    }
    console.log("Updating UI for list " + listName);

    // Build search criteria
    var lst = {}, idx = {}, mod={};
    idx.name = listName;
    lst.name = listName;
    mod["$set"] = lst;
    console.log("Checking if entry exists for list " + listName);
    l = listsColl.findOne(idx);

    // If the list exists, get the data
    if ((l === undefined) || (l._id <= 0)){
        console.log("No data found for list " + listName);
        return;
    }        

    // Update UI values
    $("#ListPurpose").val(l.purpose);
    $("#SrcTypeSel").val(l.srcType);
    if (l.uri !== undefined){
        $("#Uri").val(l.uri);
        $("#UriLink").attr('href', l.uri.trim());    
    }
    $("#ParsingRule").val(l.parsingRule);
    $("#ListTypeSel").val(l.listType);
    $("#EntTypeSel").val(l.entityType);
    $("#EntityList").val(l.entityList);
    
    // Hide some fields if it's a custom/manual list
    if (l.srcType == "manual"){
       $("#UriRow").attr("hidden", "true");
       $("#ParsingRuleRow").attr("hidden", "true");
       $("#btnGetList").attr("Disabled", "");
    }
    else{
       $("#UriRow").attr("hidden", null);        
       $("#ParsingRuleRow").attr("hidden", null);        
       $("#btnGetList").removeAttr("Disabled");
    }
}    
   
// Tweak UI for consistency
function tweakUI() {
    console.log("Tweaking UI");
    
    $("#UriLink").attr('href', $("#Uri").val());
    if ($("#SrcTypeSel").val() == "manual"){
       $("#UriRow").attr("hidden", "true");
       $("#ParsingRuleRow").attr("hidden", "true");
       $("#btnGetList").attr("Disabled", "");
    }
    else{
       $("#UriRow").attr("hidden", null);        
       $("#ParsingRuleRow").attr("hidden", null);        
       $("#btnGetList").removeAttr("Disabled");
    }
}

// Clear all UI values when changing project
function clearUI() {
    console.log("Clearing the UI");
    $("#ListPurpose").val("");
    $("#Uri").val("");
    $("#EntityID").val("");
    $("#SrcTypeSel").val("");
    $("#Uri").val("");
    $("#UriLink").attr('href', "#");    
    $("#ListTypeSel").val("");
    $("#EntTypeSel").val("");
    $("#EntityList").val("");
    $("#UriRow").attr("hidden", "true");
}
