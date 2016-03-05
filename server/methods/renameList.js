Meteor.methods({

    // Rename a list
    renameList: function (prevListName, newListName) {

        if ((prevListName === undefined) || (prevListName === "")){
            return "WARNING: Skipped rename, previous name is empty";
        }        
        if ((newListName === undefined)  || (newListName === "")){
            return "WARNING: Skipping rename, new name is empty";
        }        

        var vals = {}, critPrev = {}, critNew = {}; mod={};
        critPrev.name  = prevListName;
        critNew.name   = newListName;
        vals.name      = newListName;
        mod["$set"] = vals;
        rec1 = listsColl.findOne(critPrev);
        rec2 = listsColl.findOne(critNew);

        // Skip if the list record to be renamed doesn't exist
        if ((rec1 === undefined) || (rec1._id <= 0)){
            return "WARNING: Previous list not found: " + prevListName;
        }

        // Skip if there's already a record with the new name
        if (rec2 !== undefined){
            return "ERROR: The list " + prevListName + " cannot be renamed because " + newListName + " already exists.";
        }

        // Rename the list
        console.log("Renaming list from " + prevListName + " to " + newListName);
        updId = listsColl.update(rec1._id, mod);
        return "SUCCESS: List was renamed successfully from " + prevListName + " to " + newListName;
    }
});
