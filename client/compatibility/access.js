// TODO: Use a real server-side role mgmt implementation
var ROLE_UNASSIGNED  = "UNASSIGNED!";
var ROLE_DEVOPS      = "DevOps";
var ROLE_SOLARCH     = "Solution Architect";
var ROLE_SECANALYST  = "Security Analyst";

function getRole(user){
    if (user === 'eric')
        return ROLE_DEVOPS;
    if (user === 'admin')
        return ROLE_DEVOPS;
    if (user === 'john')
        return ROLE_SOLARCH;
    if (user === 'joe')
        return ROLE_SECANALYST;
    if (user === 'paqman')
        return ROLE_SECANALYST;
    return ROLE_UNASSIGNED;
}

function isUnknownUser(){
    var username = Meteor.user().username;
    var role = getRole(username);
    
    // Exit right away if the user isn't assigned a role.
    if (role === ROLE_UNASSIGNED) {
        console.log("WARNING: User was not assigned role to access this app."); 
        return true;
    }
    return false;
}    
