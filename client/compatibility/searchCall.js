var MAX_ALERT_LENGTH=300;

function searchCall(){
    var srcType = $("#SourceTypeSel").val();
    var entType  = $("#EntTypeSel").val();
    var entName  = $("#EntityName").val();
    var mappingType  = $("#MappingTypeSel").val();
    var searchFilter  = $("#SearchFilter").val();
    console.log("Calling search(", srcType, entType, entName, mappingType, searchFilter, ") on server"); 
    Meteor.call('search', srcType, entType, entName, mappingType, searchFilter, function (error, result) {
        if (error){
            var errMsg = error.toString();
            if ((errMsg===undefined)||(errMsg===""))
                errMsg = "An unknown error occurred (possibly a communication issue with the server-side).";
            console.log("ERROR: ", errMsg);
            Bert.alert(errMsg, 'danger', 'growl-top-right' );
        }
        else{
            // Print result to console and popup the summary to UI (1st line)
            console.log("Result:", result);
            lines = result.split("\n");
            
            // Get summary
            var summary = lines[0];
            if (summary.length > MAX_ALERT_LENGTH)
                summary = summary.substr(0,MAX_ALERT_LENGTH-3)+"...";
            
            // Get data
            var data = "";
            if (lines.length>1){
                lines.shift();
                data = lines.join("\n");
            }
            
            // Send summary (in alert bubble) and data to the UI text area
            if (result.startsWith("FAIL")){
                Bert.alert(summary + " See console for more details.", 'warning', 'growl-top-right' );
                $("#MatchedEntriesTA").val(result);
            }
            else if (result.startsWith("SUCCESS")){
                Bert.alert(summary, 'success', 'growl-top-right' );
                $("#MatchedEntriesTA").val(data);
            }
            else{
                Bert.alert(summary, 'info', 'growl-top-right' );
                $("#MatchedEntriesTA").val(result);
            }
        }
    });
}

