Template.adminTmpl.helpers({
    adminLink: function () {
        var username = Meteor.user().username;
        var role = Session.get("myRole");
        if (role === ROLE_DEVOPS){
            return "<a href='/admin' target='adminWin'>Admin</a>";
        }
    },
});

Template.roleTmpl.helpers({
    role: function () {
        return Meteor.call('getRole', username);
    },
    myRole: function (){
        var username = Meteor.user().username;
        getRoleCall(username);
        return Session.get("myRole");
    }    
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
  }
});


Template.adminButtonsTmpl.helpers({
    adminButtons: function () {
        var username = Meteor.user().username;
        var role = Session.get("myRole");
        if (role === ROLE_DEVOPS){
            var b1 = '<button id="btnCsvDeploy"  title="Deploy this list to SIEM." onclick="deployCall()">Deploy</button> ';
            var b2 = '<button id="btnCsvExport"  title="Export all list data as CSV and download." onclick="window.open(\'/lists.csv\', \'DownloadWin\')">Export All</button> ';
            return b1 + b2;                    
        }
        return "";
    },
});
