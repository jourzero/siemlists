# siemlists
Custom whitelist and blacklist manager usable by a SIEM

## Install notes
meteor create siemlists

* Add Meteor packages
```
$ meteor add accounts-ui accounts-password  # Plain password
$ meteor add iron:router                    # Enable routing to server different pages (registration, CSV output...)
$ meteor add jaredmartin:future             # For remote exec of update script
$ meteor add meteorhacks:npm                # Enable use of NPM from within Meteor (to use Node.js APIs)
$ meteor add http                           # Enable use of HTTP APIs
$ meteor add themeteorchef:bert

In one shot:
$ meteor add accounts-ui accounts-password iron:router jaredmartin:future meteorhacks:npm http themeteorchef:bert

Output of a package list should look like this:

$ meteor list
accounts-password     1.1.4  Password support for accounts
accounts-ui           1.1.6  Simple templates to add login widgets to an app
autopublish           1.0.4  (For prototyping only) Publish the entire database to all clients
blaze-html-templates  1.0.1  Compile HTML templates into reactive UI with Meteor Blaze
ecmascript            0.1.6* Compiler plugin that supports ES2015+ in all .js files
es5-shim              4.1.14  Shims and polyfills to improve ECMAScript 5 support
http                  1.1.1  Make HTTP calls to remote servers
insecure              1.0.4  (For prototyping only) Allow all database writes from the client
iron:router           1.0.12  Routing specifically designed for Meteor
jaredmartin:future    0.0.3  Makes Futures available outside packages
jquery                1.11.4  Manipulate the DOM using CSS selectors
meteor-base           1.0.1  Packages that every Meteor app needs
meteorhacks:npm       1.5.0  Use npm modules with your Meteor App
mobile-experience     1.0.1  Packages for a great mobile user experience
mongo                 1.1.3  Adaptor for using MongoDB and Minimongo over DDP
session               1.1.1  Session variable
standard-minifiers    1.0.2  Standard minifiers used with Meteor apps by default.
tracker               1.0.9  Dependency tracker to allow reactive callbacks
```
