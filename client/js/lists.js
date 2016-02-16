
Template.listsTmpl.helpers({
    // Get Projects from project collection
    lists: function () {
        return listsColl.find({},{sort: {name: -1}});
    },
});