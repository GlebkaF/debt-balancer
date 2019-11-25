const Service = require('../api-src/Service');
const processJsonRpc = require('../api-src/process-json-rpc');
const connectToMongo = require('../api-src/connect-to-mongodb');

const jsonRpcProcessor = processJsonRpc({
  async ping(params) {
    return 'pong' + JSON.stringify(params);
  },
  async addPurchase({ buyerId, price, debtorsIds, description }) {
    // TODO: Брать buyerId из авторизации?
    const db = await connectToMongo();
    const service = new Service({ db });
    
    await service.addPurchase({ buyerId, price, debtorsIds, description });

    return 'ok';
  },
  async payDebt({ debtorId, creditorId, amount }) {
    // TODO: Брать debtorId из авторизации?
    const db = await connectToMongo();
    const service = new Service({ db });
    const userInfo = await service.payDebt({ debtorId, creditorId, amount })
    return userInfo;
  },
  async getUserInfo({ id }) {
    const db = await connectToMongo();
    const service = new Service({ db });
    const userInfo = await service.getUserInfo({ id })

    if(userInfo) {
      return userInfo;
    }

    return Promise.reject("Такого юзера не существует");    
  },

  async getUsers() {
    const db = await connectToMongo();
    const service = new Service({ db });
    const users = await service.getUsers()

    return users;
  }
})

const rpcEndPoint = async (req, res) => {
  // Чтобы не падали preflight запросы в браузере
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  if (req.method !== 'POST') {
    return res.status(400).send('Endpoint обрабатывает только метод POST и OPTIONS');
  }

  try {
    return res.status(200).json(await jsonRpcProcessor(req.body));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

module.exports = rpcEndPoint;

