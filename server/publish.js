Meteor.publish('lists', function(){
    var currentUserId = this.userId;
    var username = Meteor.users.findOne({"_id": currentUserId}).username;

    // Get role name for user
    var role = Meteor.call('getRole', username);
    
    // Publishing lists based on user role
    if (role === ROLE_DEVOPS)
        return listsColl.find({},{sort: {name: 1}});

    if (role === ROLE_SECANALYST)
        return listsColl.find( { $or: [ { listType: 'BL'}, { listType: 'WL' } ] }, {sort: {name: 1}});

    if (role === ROLE_SOLARCH)
        return listsColl.find({listType: 'CONF'},{sort: {name: 1}});
    return [];       
});
