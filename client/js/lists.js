
Template.listsTmpl.helpers({
    lists: function () {
        return listsColl.find({},{sort: {name: 1}});
    },
    delButton: function (){
        username = Meteor.user().username;
        if (username === 'admin'){        
            return '<button id="btnDelList" title="Delete the current list">Delete</button>';
        }
    }
});