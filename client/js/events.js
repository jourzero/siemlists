// Handle events in body
Template.home.events({
    'change #ListName': function (event) {
        console.log("List name changed to " + event.target.value);
        // Get the project name and update UI
        Session.set("listName", event.target.value);
        updateUIFromListName();
   },    
    'click #ListName': function () {
        // Clear the input so that a new list name can be selected
        console.log("ListName clicked, clearing the value so that the pulldown shows all lists");
        $("#ListName").val("");
        Session.set("listName", "");
        clearUI();
    },
    'change #ListPurpose, change #SrcTypeSel, change #Uri, change #ListTypeSel, change #EntTypeSel, change #EntityID, change #ListText, change #EntityList': function (event) {
        console.log("Changed " + event.target.id);
        saveListDataFromUI();
        tweakUI();
    },
    'click': function (event){
        console.log("Clicked " + event.target.id);
    },
});
