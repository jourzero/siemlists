// Handle events in home page
Template.home.events({
    'change #ListName': function (event) {
        var newListName  = event.target.value;
        if ((newListName === undefined) && (newListName == ""))
           return;
        console.log("List name changed to " + newListName);
        var prevListName = Session.get("listName");
        renameListFromUI(prevListName, newListName);
        Session.set("listName", newListName);        
        updateUIFromListName();
   },    
    'dblclick #ListName': function () {
        // Clear the input so that a new list name can be selected
        console.log("ListName clicked, clearing the value so that the pulldown shows all lists");
        $("#ListName").val("");
        Session.set("listName", "");
        clearUI();
    },
    'change #ListPurpose, change #SrcTypeSel, change #Uri, change #ParsingRule, change #ListTypeSel, change #EntTypeSel, change #EntityList': function (event) {
        console.log("Changed " + event.target.id);
        saveListDataFromUI();
        tweakUI();
    },
    'click': function (event){
        console.log("Clicked " + event.target.id);
    },
    'dblclick': function (event){
        console.log("Double-Clicked " + event.target.id);
    },
    'click #btnGetList': function(){
        var uri = $("#Uri").val();
        var parsingRule = $("#ParsingRule").val();
        console.log("Getting entity list from URI " + uri + ". Please be patient...");
        //alert("Getting entity list from URI " + uri + ". Please wait for the separate 'Done' popup.");
        /* Async doesn't work (not sure why)
        var result = Meteor.call('getList', uri, parsingRule);
        $("#EntityList").val(result);
        saveListDataFromUI();
        */
        Meteor.call('getList', uri, parsingRule, function (error, result) {
            //alert("Done. See console log if needed.");
            if (error)
              console.log("ERROR: ", error);

            $("#EntityList").val(result);
            saveListDataFromUI();
        });
    }
});

// Handle events in admin page
Template.admin.events({
    'click': function (event){
        console.log("Clicked " + event.target.id);
    },
    'click #btnDelUser': function (event){
        console.log("Deleting " + event.target.id + "=" + event.target.value);
        usersColl.remove({_id: event.target.value});
    },
});

