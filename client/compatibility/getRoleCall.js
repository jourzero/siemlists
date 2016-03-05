function getRoleCall(username){
    console.log("Sending getRole command for user", username); 
    Meteor.call('getRole', username, function (error, role) {
        if (error){
            console.log("ERROR: ", error.toString());
            Bert.alert(error.toString, 'danger', 'growl-top-right' );
        }
        else{
            // Print result to console and popup the summary to UI (1st line)
            console.log("My role is", role);
            Session.set("myRole", role);
        }
    });
}
