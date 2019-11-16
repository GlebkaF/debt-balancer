const MongoClient = require('mongodb').MongoClient;

module.exports = async function connectToMongo() {    
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const connection = await client.connect()
    const db = connection.db('debt-balancer');
    return db;
}