function deployCall(){
    var listName = $("#ListName").val();
    console.log("Sending deploy command for list", listName); 
    Meteor.call('deploy', listName, function (error, result) {
        if (error){
            console.log("ERROR: ", error.toString());
            Bert.alert(error.toString, 'danger', 'growl-top-right' );
        }
        else{
            // Print result to console and popup the summary to UI (1st line)
            console.log("Result:", result);
            lines = result.split("\n");
            var summary = lines[0];
            if (summary.length > MAX_ALERT_LENGTH)
                summary = summary.substr(0,MAX_ALERT_LENGTH-3)+"...";
            if (result.startsWith("FAIL") || result.startsWith("ERROR") || result.startsWith("WARNING"))
                Bert.alert(summary + " See console for more details.", 'warning', 'growl-top-right' );
            else if (result.startsWith("PASS") || result.startsWith("SUCCESS"))
                Bert.alert(summary, 'success', 'growl-top-right' );
            else
                Bert.alert(summary, 'info', 'growl-top-right' );
        }
    });
}
