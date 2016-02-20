function validateCall(){
    var listName = $("#ListName").val();
    console.log("Calling validate(", listName, ") on server"); 
    Meteor.call('validate', listName, function (error, result) {
        if (error){
          console.log("ERROR: ", error.toString());
            //alert("ERROR: ", error.toString());
            Bert.alert( result, 'danger', 'growl-top-right' );
        }
        else{
            console.log("Result:", result);
            //alert(result);
            if (result.startsWith("FAIL"))
                Bert.alert( result, 'warning', 'growl-top-right' );
            else if (result.startsWith("PASS"))
                Bert.alert( result, 'success', 'growl-top-right' );
            else
                Bert.alert( result, 'info', 'growl-top-right' );
        }
    });
}