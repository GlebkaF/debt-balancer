const Service = require('./Service');

const LERA = 'Devkabezruki';
const GLEB = 'glebkaf';
const ANTON = 'anikin_antosha';


describe('Service', () => {
    it('Должен инициализироваться', () => {
        const service = new Service({ users: {} });
        expect(service).toBeTruthy()
    })

    describe('Добавление общей покупки', () => {
        it('Должен создавать балансы между юзерами если балансов между юзерами еще нет', () => {
            const users = {
                [LERA]: {
                    balance: {},
                },
                [GLEB]: {
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
                [GLEB]: {
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

        it('Должен обновлять балансы если во владельцах покупки нет покупателя', () => {
            const users = {
                [LERA]: {
                    balances: {},
                },
                [GLEB]: {
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
                    LERA,
                    ANTON
                ]
            })

            expect(service.users[GLEB].balances[ANTON]).toBe(200);
            expect(service.users[ANTON].balances[GLEB]).toBe(-200);
            expect(service.users[GLEB].balances[LERA]).toBe(300);
            expect(service.users[LERA].balances[GLEB]).toBe(-300);
            expect(service.users[GLEB].balances[GLEB]).toBeUndefined();
        })
    })

    describe('Погашение долга', () => {
        it('Должен гасить долг полностью', () => {
            const users = {
                [LERA]: {
                    balances: {},
                },
                [GLEB]: {
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

            service.payDebt({
                debtorId: ANTON,
                creditorId: GLEB,
                amount: 100,                
            })

            expect(service.users[GLEB].balances[ANTON]).toBe(0);
            expect(service.users[ANTON].balances[GLEB]).toBe(0);
        })

        it('Должен гасить долг частично', () => {
            const users = {
                [LERA]: {
                    balances: {},
                },
                [GLEB]: {
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

            service.payDebt({
                debtorId: ANTON,
                creditorId: GLEB,
                amount: 50,                
            })

            expect(service.users[GLEB].balances[ANTON]).toBe(-50);
            expect(service.users[ANTON].balances[GLEB]).toBe(50);
        })
    })

    describe('Просмотр информации о балансе юзера', () => {
        it('Должен выводить баланс существующего юзера', ()=> {
            const users = {
                [LERA]: {
                    balances: {
                        [GLEB]: -3000,
                        [ANTON]: -200,
                    },
                },
                [GLEB]: {
                    balances: {
                        [ANTON]: -100,
                        [LERA]: 3000,
                    },
                },
                [ANTON]: {
                    balances: {
                        [GLEB]: 100,
                        [LERA]: 200,
                    }
                }
            }

            const service = new Service({ users });

            const gleb = service.getUserInfo({ userId: GLEB});

            expect(gleb.balances).toEqual({
                [ANTON]: -100,
                [LERA]: 3000,
            },);
        })
    })
})