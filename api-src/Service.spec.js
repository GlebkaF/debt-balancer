const Service = require('./Service');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(120000);

async function getDB() {
    const server = new MongoMemoryServer({
        binary: {
            version: '3.4.9',
        },
    });
    const url = await server.getConnectionString();
    const connection = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = connection.db(await server.getDbName());

    return db;
}


const LERA = 'Devkabezruki';
const GLEB = 'glebkaf';
const ANTON = 'anikin_antosha';


describe('Service', () => {
    it('Должен инициализироваться', async () => {
        const db = await getDB()
        const service = new Service({ users: {}, db });
        expect(service).toBeTruthy()
    })

    describe('Добавление общей покупки', () => {
        it('Должен создавать балансы между юзерами если балансов между юзерами еще нет', async () => {
            const db = await getDB();

            await db.collection('users').insertMany([
                {
                    id: LERA,
                    balances: {},
                },
                {
                    id: GLEB,
                    balances: {},
                },
                {
                    id: ANTON,
                    balances: {}
                }
            ])

            const service = new Service({ db });

            await service.addPurchase({
                buyerId: GLEB,
                price: 600,
                debtorsIds: [
                    GLEB,
                    ANTON
                ]
            })

            const [gleb, anton] = await Promise.all([
                db.collection('users').findOne({ id: GLEB }),
                db.collection('users').findOne({ id: ANTON })]
            );

            expect(gleb.balances[ANTON]).toBe(300);
            expect(anton.balances[GLEB]).toBe(-300);
            expect(gleb.balances[GLEB]).toBeUndefined();
        })

        it('Должен обновлять балансы между юзерами если между юзерами уже есть баланс', async () => {

            const db = await getDB();

            await db.collection('users').insertMany([
                {
                    id: LERA,
                    balances: {},
                },
                {
                    id: GLEB,
                    balances: {
                        [ANTON]: -100
                    },
                },
                {
                    id: ANTON,
                    balances: {
                        [GLEB]: 100
                    }
                }
            ])

            const service = new Service({ db });

            await service.addPurchase({
                buyerId: GLEB,
                price: 600,
                debtorsIds: [
                    GLEB,
                    ANTON
                ]
            })

            const [gleb, anton] = await Promise.all([
                db.collection('users').findOne({ id: GLEB }),
                db.collection('users').findOne({ id: ANTON })]
            );

            expect(gleb.balances[ANTON]).toBe(200);
            expect(anton.balances[GLEB]).toBe(-200);
            expect(gleb.balances[GLEB]).toBeUndefined();
        })

        it('Должен обновлять балансы если во владельцах покупки нет покупателя', async () => {
            const db = await getDB();

            await db.collection('users').insertMany([
                {
                    id: LERA,
                    balances: {},
                },
                {
                    id: GLEB,
                    balances: {
                        [ANTON]: -100
                    },
                },
                {
                    id: ANTON,
                    balances: {
                        [GLEB]: 100
                    }
                }
            ])
            const service = new Service({ db });

            await service.addPurchase({
                buyerId: GLEB,
                price: 600,
                debtorsIds: [
                    LERA,
                    ANTON
                ]
            })

            const [gleb, anton, lera] = await Promise.all([
                db.collection('users').findOne({ id: GLEB }),
                db.collection('users').findOne({ id: ANTON }),
                db.collection('users').findOne({ id: LERA })
            ]);

            expect(gleb.balances[ANTON]).toBe(200);
            expect(anton.balances[GLEB]).toBe(-200);
            expect(gleb.balances[LERA]).toBe(300);
            expect(lera.balances[GLEB]).toBe(-300);
            expect(gleb.balances[GLEB]).toBeUndefined();
        })
    })

    describe('Погашение долга', () => {
        it('Должен гасить долг полностью', async () => {
            const db = await getDB();
            
            await db.collection('users').insertMany([
                {
                    id: LERA,
                    balances: {},
                },
                {
                    id: GLEB,
                    balances: {
                        [ANTON]: -100
                    },
                },
                {
                    id: ANTON,
                    balances: {
                        [GLEB]: 100
                    }
                }
            ])

            const service = new Service({ db });

            await service.payDebt({
                debtorId: ANTON,
                creditorId: GLEB,
                amount: 100,
            })

            const [gleb, anton] = await Promise.all([
                db.collection('users').findOne({ id: GLEB }),
                db.collection('users').findOne({ id: ANTON })                
            ]);

            expect(gleb.balances[ANTON]).toBe(0);
            expect(anton.balances[GLEB]).toBe(0);
        })

        it('Должен гасить долг частично', async () => {
            const db = await getDB();
            
            await db.collection('users').insertMany([
                {
                    id: LERA,
                    balances: {},
                },
                {
                    id: GLEB,
                    balances: {
                        [ANTON]: -100
                    },
                },
                {
                    id: ANTON,
                    balances: {
                        [GLEB]: 100
                    }
                }
            ])

            const service = new Service({ db });

            await service.payDebt({
                debtorId: ANTON,
                creditorId: GLEB,
                amount: 50,
            })

            const [gleb, anton] = await Promise.all([
                db.collection('users').findOne({ id: GLEB }),
                db.collection('users').findOne({ id: ANTON })                
            ]);

            expect(gleb.balances[ANTON]).toBe(-50);
            expect(anton.balances[GLEB]).toBe(50);
        })
    })

    describe('Просмотр информации о балансе юзера', () => {
        it('Должен выводить баланс существующего юзера', async () => {
            const db = await getDB();
            
            await db.collection('users').insertMany([
                {
                    id: LERA,
                    balances: {
                        [GLEB]: -3000,
                        [ANTON]: -200,
                    },
                },
                {
                    id: GLEB,
                    balances: {
                        [ANTON]: -100,
                        [LERA]: 3000,
                    },
                },
                {
                    id: ANTON,
                    balances: {
                        [GLEB]: 100,
                        [LERA]: 200,
                    }
                }
            ])

            const service = new Service({ db });

            const gleb = await service.getUserInfo({ id: GLEB });

            expect(gleb.balances).toEqual({
                [ANTON]: -100,
                [LERA]: 3000,
            }, );
        })
    })
})