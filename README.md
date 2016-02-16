# siemlists
Custom whitelist and blacklist manager usable by a SIEM

## Install notes
meteor create siemlists

* Add Meteor packages
```
$ meteor add accounts-ui accounts-password  # Plain password
$ meteor add iron:router                    # Enable routing to server different pages (registration, CSV output...)

Optionally:
$ meteor add jaredmartin:future             # For remote exec of git-update.sh
$ meteor add appcache                       # Enable browser caching 
$ meteor add meteorhacks:npm                # Enable use of NPM from within Meteor (to use Node.js APIs)
$ meteor add dburles:eslint                 # Javascript static analysis
$ meteor add sergeyt:typeahead              # Typeahead for CWE Name and Test Name lookups
$ meteor add accounts-ui accounts-google    # Google OAuth (or the below)
```
