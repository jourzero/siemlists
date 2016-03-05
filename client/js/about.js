Template.about.helpers({

username: function () {
        var username = Meteor.user().username;
        if (username !== undefined)
            return username;
        return "";
  },
  role: function () {
        return Session.get("myRole");
  },
})