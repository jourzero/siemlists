function deployCall(){
    var listName = $("#ListName").val();
    console.log("Sending deploy command for list", listName); 
    Meteor.call('deploy', listName, function (error, result) {
        if (error){
          alert("ERROR: ", error.toString());
        }
        else{
            console.log("Result:", result);        
            alert(result);
        }
    });
}
