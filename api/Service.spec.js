const Service = require('./Service');

const LERA = 'Devkabezruki';
const GLEB = 'glebkaf';
const ANTON = 'anikin_antosha';


describe('Service', () => {
    it('Должен инициализироваться', () => {
        const service = new Service({ users: {} });
        expect(service).toBeTruthy()
    })

    it('Должен создавать балансы между юзерами если балансов между юзерами еще нет', () => {
        const users = {
            [LERA]: {
                balance: {},
            },
            [GLEB]:{
                balance: {},
            },
            [ANTON]: {
                balance: {}
            }
        }
        const service = new Service({ users });

        service.addPurchase({
            buyerId: GLEB,
            price: 600,
            usersIds: [
                GLEB,
                ANTON
            ]
        })        

        expect(service.users[GLEB].balances[ANTON]).toBe(300);
        expect(service.users[ANTON].balances[GLEB]).toBe(-300);
        expect(service.users[GLEB].balances[GLEB]).toBeUndefined();
    })
    
    it('Должен обновлять балансы между юзерами если между юзерами уже есть баланс', () => {
        const users = {
            [LERA]: {
                balances: {},
            },
            [GLEB]:{
                balances: {
                    [ANTON]: -100
                },
            },
            [ANTON]: {
                balances: {
                    [GLEB]: 100
                }
            }
        }
        const service = new Service({ users });

        service.addPurchase({
            buyerId: GLEB,
            price: 600,
            usersIds: [
                GLEB,
                ANTON
            ]
        })        

        expect(service.users[GLEB].balances[ANTON]).toBe(200);
        expect(service.users[ANTON].balances[GLEB]).toBe(-200);
        expect(service.users[GLEB].balances[GLEB]).toBeUndefined();
    })  
})