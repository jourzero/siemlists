/*
// Add new entry to TestKB
function newTest() {

    kvp = {}; mod = {};
    tid = new Date().toISOString().split(".")[0].replace(/[-:]/g, '');
    kvp._id       = new Mongo.ObjectID();
    kvp.TID       = "EXT-" + tid;
    kvp.TSource   = "Extras";
    kvp.TTestName = ""; 
    $("#TTestName").val("");
    kvp.TPhase    = "Extras";
    mod["$set"] = kvp;
    id = testkbColl.insert(kvp);
    alert("Inserted new test EXT-" + tid + " (" + id + "). Pls fill other fields.");
}

// Update Test KB upon changes in the UI
function updateTestKBFromUI(tgtId, tgtVal) {

    oid = $("#OID").val();
    newVal = tgtVal;
    if ((tgtId === 'TPCI') || (tgtId === 'TTop10') || (tgtId === 'TTop25') || (tgtId === 'TStdTest'))
        newVal = $("#" + tgtId).prop("checked");

    console.log("Updating TestKB for OID " + oid + ": " + tgtId + "=" + newVal);
    kvp = {};
    mod = {};
    kvp[tgtId] = newVal;
    mod["$set"] = kvp;
    n = testkbColl.update(new Mongo.ObjectID(oid), mod);
    console.log("Number of updated records: " + n);
}



// Update/insert issue data from UI into the project collection
function saveIssueDataFromUI(tgtId, tgtVal) {

    // Get common issue values from UI
    //tid         = $( "#testSel option:selected" ).text();
    tid         = $( "#testSel option:selected" ).val();
    cid         = $('#cweref').html();
    issueName   = $('#TIssueName').val();
    prjName     = $('#PrjName').val();

    // Check that the UI has the mandatory data we need
    if ((tid === undefined) || (tid === "")){
        alert("Cannot save issue data: Missing Test ID.");
        return;
    }
    if ((issueName === undefined) || (issueName === "")){
        alert("Cannot save issue data: Missing Issue Name.");
        return;
    }

    // Check if issue already exists
    console.log("Saving issue data for TID " +tid + ": " + tgtId + "=" + tgtVal);
    var issue={}; var mod={}; var oid={};
    oid.TID     = tid;
    issue.CweId = cid;
    issue.TID   = tid;
    issue.TIssueName = issueName;    
    issue.TSeverity  = $('#TSeverity').val();
    issue.TSeverityText = $("#TSeverity option:selected").text();
    issue.IURIs      = $('#IURIs').val();
    issue.IEvidence  = $('#IEvidence').val();
    issue.IPriority  = $('#IPriority').val();
    issue.IPriorityText  = $("#IPriority option:selected").text();
    issue.INotes     = $('#INotes').val();
    issue.PrjName    = prjName;

    mod["$set"] = issue;
    console.log("Checking if entry exists for issue");
    i = issueColl.findOne(oid);

    // If the issue doesn't exist, insert a new record. If not, use upsert.
    if ((i === undefined) || (i._id <= 0)){
        console.log("Adding new issue with CweID=" + cid);
        mid = issueColl.insert(issue);
        console.log("Mongo _id for new record: " + mid);
    }
    else{
        console.log("Updating issue data for object " + i._id);
        mid = issueColl.upsert(i._id, mod);
        console.log("Mongo _id for new record: " + mid);        
    }    
}
*/

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
    
    var lst = {}, idx = {}, mod={};
    idx.name       = prevListName;
    lst.name       = newListName;
    mod["$set"] = lst;
    i = listsColl.findOne(idx);

    // If the issue doesn't exist, insert a new record. If not, use upsert.
    if ((i === undefined) || (i._id <= 0)){
        console.log("Previous list not found: " + prevListName);
        return;
    }
    else{
        console.log("Renaming list from " + prevListName + " to " + newListName);
        updId = listsColl.update(i._id, mod);
        Session.set("listName", newListName);
    }
}
