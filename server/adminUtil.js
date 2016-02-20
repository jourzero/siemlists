Meteor.startup(function () {
    createUser('peter', 'Peter Smith', 'sm1tten3d?', true);
    createUser('sue', 'Sue Helen', 'sus4ny0uth3r3?', false);
    createUser('admin','Administrator', 'ch@ng3Th1sN0w0k?', true);
    createUser('john', 'John Doe', String(Math.random()*100000000000000000), true);
    createUser('joe', 'Joe Don', String(Math.random()*100000000000000000), false);
});

// Create a user and send the password to the server console
// Example console message: Created account for user john with password 25962559529580176
function createUser(user, name, pwd, isAdmin){
    if (Accounts.findUserByUsername(user) === undefined){
        Accounts.createUser({username: user, password: pwd, profile: {name: name}, isAdmin: isAdmin});
        console.log("Created account for user " + user + " with password " + pwd);
    }
}

