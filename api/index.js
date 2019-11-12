const MongoClient = require('mongodb').MongoClient;

const Service = require('./Service');

module.exports = async (req, res) => {
    try {
      const id = req.query.id;
      const db = await connectToMongo();
      const service = new Service({ db});
      const userInfo = await service.getUserInfo({ id: 'glebkaf'})      
      res.json(userInfo);
    } catch(error) {
      res.send(error);  
    }
}

async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  const connection = await client.connect()
  const db = connection.db('debt-balancer');  
  return db;
}