Template.adminTmpl.helpers({
    adminLink: function () {
        username = Meteor.user().username;
        if (username === 'admin'){
            return "<a href='/admin' target='adminWin'>Admin</a>";
        }
    },
});

Template.userList.helpers({
  users: function () {
    return Meteor.users.find();
  },
  username: function () {
        if (this.username !== undefined)
            return this.username;
        return "";
  },
  email: function () {
        if (this.emails !== undefined)
            return this.emails[0].address;
        return "";
  },
  id:function() {
        if (this._id !== undefined)
          return this._id;
        return "";
  }
})