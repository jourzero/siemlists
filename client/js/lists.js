
Template.listsTmpl.helpers({
    lists: function () {
        var username = Meteor.user().username;
        var role = getRole(username);
        if (role === ROLE_DEVOPS)
            return listsColl.find({},{sort: {name: 1}});

        if (role === ROLE_SECANALYST)
            return listsColl.find( { $or: [ { listType: 'BL'}, { listType: 'WL' } ] }, {sort: {name: 1}});

        if (role === ROLE_SOLARCH)
            return listsColl.find({listType: 'CONF'},{sort: {name: 1}});
        
        return [];
    },
    
    delButton: function (){
        var username = Meteor.user().username;
        var role = getRole(username);
        if (role === ROLE_DEVOPS)
            return '<button id="btnDelList" title="Delete the current list">Delete</button>';
    }
});