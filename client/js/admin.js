Template.adminTmpl.helpers({
    adminLink: function () {
        var username = Meteor.user().username;
        var role = getRole(username);
        if (role === 'DevOps'){
            return "<a href='/admin' target='adminWin'>Admin</a>";
        }
    },
});

Template.userList.helpers({
  users: function () {
    return Meteor.users.find({},{sort: {username: 1}});
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
  },
  role: function () {
      return getRole(this.username);
  },
});


Template.adminButtonsTmpl.helpers({
    adminButtons: function () {
        var username = Meteor.user().username;
        var role = getRole(username);
        if (role === 'DevOps'){
            var b1 = '<button id="btnCsvDeploy"  title="Deploy this list to SIEM." onclick="deployCall()">Deploy</button> ';
            var b2 = '<button id="btnCsvExport"  title="Export all list data as CSV and download." onclick="window.open(\'/lists.csv\', \'DownloadWin\')">Export All</button> ';
            return b1 + b2;                    
        }
        return "";
    },
});
