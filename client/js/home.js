
Template.home.helpers({
    userText: function () {
        if (Meteor.user().username !== undefined) 
            return "Logged-in as " + Meteor.user().username;

        if (Meteor.user().emails !== undefined)    
            return "Logged-in as " + Meteor.user().emails[0].address;
        
        return "(unknown user)";
    },
});

