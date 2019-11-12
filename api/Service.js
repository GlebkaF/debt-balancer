const _ = require('lodash')

class Service {
    constructor({ users }) {
        this.users = users;
    }
    /**
     * Добавляет общую покупку нa price рублей, от имени buyerId
     * стоимость покупки поделится равными частями между пользователями usersIds
     * 
     * @param {string} buyerId 
     * @param {number} price - сумма в рублях 
     * @param {Array<string>} usersIds 
     */
    addPurchase({ buyerId, price, usersIds }) {
        const debt = Math.round(price / usersIds.length);

        // Убираем покупателя из списка должников, т.к. сам себе должен он быть не может
        const debtorsIds = _.without(usersIds, buyerId);

        debtorsIds.forEach((debtorId) => {
            const updateBalance = debt => balance => (balance || 0) + debt;

            _.update(this.users, [debtorId, 'balances', buyerId], updateBalance(-debt));
            _.update(this.users, [buyerId, 'balances', debtorId], updateBalance(debt));
        });

    }

    payDebt() { }
}

module.exports = Service;