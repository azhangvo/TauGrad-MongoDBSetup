# Setting up MongoDB for TauGrad

## MongoDB Installation

Begin by installing the MongoDB instance for your intended host's operating system.

### Windows

[MongoDB Official Windows Tutorial](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

### Mac

[MongoDB Official macOS Tutorial](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

### Linux

[MongoDB Official Linux Tutorial](https://docs.mongodb.com/manual/administration/install-on-linux/)

Depending on the distribution, it may be possible to install MongoDB by simply running:
```bash
sudo apt install mongodb
```
(This is what I did)

## MongoDB Setup

After installing the MongoDB software, it is best to create an admin user for admin access, then a restricted user for TauGrad to use. To do this, first connect to the MongoDB by running the following:

```bash
mongo
```

You should see something like the following show up.

```bash
MongoDB shell version v3.6.8
connecting to: mongodb://127.0.0.1:27017
Implicit session: session { "id" : UUID("000000-0000-0000-0000-000000000000") }
MongoDB server version: 3.6.8
Welcome to the MongoDB shell.
For interactive help, type "help".
```

In this new terminal, run the following after changing the username and password to secure values:

```bash
use admin
db.createUser(
  {
    user: "<myusername>",
    pwd: "<mysecurepassword>",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" },
             { role: "readWriteAnyDatabase", db: "admin" } ]
  }
)
```

Additionally, add a user that only has access to the TauGrad database:

```bash
use taugrad
db.createUser(
  {
    user: "<myusername2>",
    pwd:  "<mypassword2>",
    roles: [ { role: "readWrite", db: "taugrad" } ]
  }
)
```

Then, shutdown the MongoDB server:

```bash
db.adminCommand( { shutdown: 1 } )
```

You may need to disconnect from the Mongo shell afterward by pressing ctrl + D.

Now, enable authorization on the MongoDB server. If you use a configuration file to run the MongoDB server, it can be found in [one of these locations](https://docs.mongodb.com/manual/reference/configuration-options/#std-label-configuration-options). In the case of a configuration file, add (or edit) the following to the file:

```
security:
    authorization: enabled
```

(In some cases, the configuration file may not be in a YAML format. In this case, look for a line that says `#auth=true` and uncomment it (remove the hashtag) to enable auth, so the line changes to `auth=true`)

If the MongoDB is being started from the commandline, add the `--auth` option to the command, ex:

```bash
mongod --auth --port 27017
```

Finally, restart the MongoDB server. For example, `sudo systemctl start mongod` or `sudo service mongodb restart`.

## Collection and Database Setup

To setup the required database, collections, and documents for TauGrad, first install the dependencies:

```bash
npm install
``` 

Then, edit the [configuration file](./config.json) and fill in information pointing to the MongoDB server that was just setup. With a default setup, the ip will be `127.0.0.1` and the port will be `27017`.

Finally, run the [setup.js](./setup.js) file:

```bash
node setup.js
```

After the setup script finishes, that's it!
