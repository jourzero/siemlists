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
```
