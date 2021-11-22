const {MongoClient} = require('mongodb');
const config = require("./config.json")

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = `mongodb://${config["username"]}:${config["password"]}@${config["ip"]}:${config["port"]}/taugrad?retryWrites=true&w=majority`;


    const client = new MongoClient(uri);

    try {
        console.log("Connecting to database...")
        await client.connect();

        let db = client.db("taugrad")

        console.log("Creating collections...")
        await db.createCollection("regulation");
        await db.createCollection("teams");
        await db.createCollection("users");

        console.log("Creating documents...")
        await db.collection("regulation").insertOne({use: "restriction", enabled: true})
        await db.collection("teams").insertOne({specificUse: "databaseInfo", teamId: 0})
        await db.collection("users").insertOne({specificUse: "databaseInfo", userId: 0})

        console.log("Done.")
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
