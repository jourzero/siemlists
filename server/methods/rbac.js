Meteor.methods({
    
    // Get the role name a user is in
    getRole: function (user){
        var role = USER_ROLE[user];
        //console.log("Role for", user, "is", role);
        if ((role === undefined) || (role === ""))
            return ROLE_UNASSIGNED;
        return role;
    },

    // Check if a user is unknown (not part of a role)
    isUnknownUser:function(){
        var currentUserId = this.userId;
        var username = Meteor.users.findOne({"_id": currentUserId}).username;
        var role = getRole(username);

        // Exit right away if the user isn't assigned a role.
        if (role === ROLE_UNASSIGNED) {
            console.log("WARNING: User was not assigned role to access this app."); 
            return true;
        }
        return false;
    }    
});
