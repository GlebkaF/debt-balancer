const _ = require('lodash')

const updateBalance = balanceUpdate => currentBalance => (currentBalance || 0) + balanceUpdate;

class ServiceError extends Error { }

class Service {
    constructor({ users }) {
        // Если баланс юзера положительный, значит ему должны
        // Если отрицательный, значит он должен
        this.users = users;
    }

    /**
     * Добавляет общую покупку нa price рублей, от имени buyerId
     * стоимость покупки поделится равными частями между пользователями usersIds
     * 
     * @param {Object} params
     * @param {string} params.buyerId - покупатель
     * @param {number} params.price - сумма в рублях 
     * @param {Array<string>} params.usersIds - для кого предназначается покупка, может как влючать покупателя, так и не включать
     */
    addPurchase({ buyerId, price, usersIds }) {
        if(!buyerId || !price || !usersIds) {
            throw new ServiceError('Не переданы обязательные параметры')
        }

        if (price < 0) {
            throw new ServiceError('Покупка не может быть на отрицательную сумму')
        }

        const debt = Math.round(price / usersIds.length);

        // Убираем покупателя из списка должников, т.к. сам себе должен он быть не может
        const debtorsIds = _.without(usersIds, buyerId);

        debtorsIds.forEach((debtorId) => {
            _.update(this.users, [debtorId, 'balances', buyerId], updateBalance(-debt));
            _.update(this.users, [buyerId, 'balances', debtorId], updateBalance(debt));
        });
    }

    /**
     * Гасит задолженность
     * @param {Object} params
     * @param {string} params.debtorId - должник, тот кто гасит долг
     * @param {string} params.creditorId - кредитор, тот кому должны
     * @param {string} params.amount - на сколько рублей гасим долг
     */
    payDebt({ debtorId, creditorId, amount }) {
        if(!debtorId || !creditorId || !amount) {
            throw new ServiceError('Не переданы обязательные параметры')
        }

        if (debtorId === creditorId) {
            throw new ServiceError('Нельзя погасить долг самому себе')
        }

        if (amount < 0) {
            throw new ServiceError('Нельзя погасить долг на отрицательную сумму')
        }        

        _.update(this.users, [debtorId, 'balances', creditorId], updateBalance(-amount));
        _.update(this.users, [creditorId, 'balances', debtorId], updateBalance(amount));
    }

    /**
     * Получает информацию о юзере по id
     * @param {string} userId 
     */
    getUserInfo({ userId }) {
        return this.users[userId];
    }
}

module.exports = Service;