function validateCall(){
    var listName = $("#ListName").val();
    console.log("Calling deploy(", listName, ") on server"); 
    Meteor.call('validate', listName, function (error, result) {
        if (error){
          console.log("ERROR: ", error);
          alert("ERROR: ", error);
        }
        else{
            alert(result);
        }
    });
}