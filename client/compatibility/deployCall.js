function deployCall(){
    var listName = $("#ListName").val();
    console.log("Calling deploy(", listName, ") on server"); 
    Meteor.call('deploy', listName, function (error, result) {
    if (error)
      console.log("ERROR: ", error);
    });
}