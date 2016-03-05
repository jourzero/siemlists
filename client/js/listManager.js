Meteor.subscribe('lists');

Template.listsTmpl.helpers({
    lists: function () {
        return listsColl.find({},{sort: {name: 1}});
    },
        
    delButton: function (){
        var role = Session.get("myRole");
        if (role === ROLE_DEVOPS)
            return '<button id="btnDelList" title="Delete the current list">Delete</button>';
    }
});