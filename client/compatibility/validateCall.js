var MAX_ALERT_LENGTH=300;

function validateCall(){
    var listName = $("#ListName").val();
    console.log("Calling validate(", listName, ") on server"); 
    Meteor.call('validate', listName, function (error, result) {
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
            if (result.startsWith("FAIL"))
                Bert.alert(summary + " See console for more details.", 'warning', 'growl-top-right' );
            else if (result.startsWith("PASS"))
                Bert.alert(summary, 'success', 'growl-top-right' );
            else
                Bert.alert(summary, 'info', 'growl-top-right' );
        }
    });
}


/*
 * Bert.alert() quick ref

These define how an alert with Bert looks.

Type	Appearance
default	Displays a message with a grey background and a  icon.
success	Displays a message with a green background and a  icon.
info	Displays a message with a blue background and a  icon.
warning	Displays a message with a yellow background and a  icon.
danger	Displays a message with a red background and a  icon.
Styles

These define where an alert with Bert appears.

Type	Appearance
fixed-top	Displays a message fixed at the top of the window.
fixed-bottom	Displays a message fixed at the bottom of the window.
growl-top-left	Displays a message fixed in the top left corner of the window.
growl-top-right	Displays a message fixed in the top right corner of the window.
growl-bottom-left	Displays a message fixed in the bottom left corner of the window.
growl-bottom-right	Displays a message fixed in the bottom right corner of the window.
 */