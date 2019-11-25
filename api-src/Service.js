const _ = require("lodash");
const { Db } = require("mongodb");

const updateBalance = balanceUpdate => currentBalance =>
  (currentBalance || 0) + balanceUpdate;

class ServiceError extends Error {}

class Service {
  constructor({ users, db }) {
    // Если баланс юзера положительный, значит ему должны
    // Если отрицательный, значит он должен
    this.users = users;
    /** @type {Db} */
    this._db = db;
  }

  /**
   * Добавляет общую покупку нa price рублей, от имени buyerId
   * стоимость покупки поделится равными частями между пользователями debtorsIds
   *
   * @param {Object} params
   * @param {string} params.buyerId - Кредитор - покупатель
   * @param {number} params.price - сумма в рублях
   * @param {Array<string>} params.debtorsIds - Должники, для которых предназначается покупка, может как влючать покупателя, так и не включать
   */
  async addPurchase({ buyerId, price, debtorsIds }) {
    // TODO: проверить что buyerId и debtorsIds существуют

    if (!buyerId || !price || !debtorsIds) {
      throw new ServiceError(
        "Не передан обязательный параметр buyerId, price или debtorsIds"
      );
    }

    if (!_.isNumber(price)) {
      throw new ServiceError("price должен быть числом");
    }

    if (price < 0) {
      throw new ServiceError("Покупка не может быть на отрицательную сумму");
    }

    const debt = Math.round(price / debtorsIds.length);

    // Нам нужно достать из базы всех учавствующих юзеров, чтобы обновить их баланс
    // т.к. покупатель не обязательно внутри массива должников, нужно склеить их в единый массив.
    const usersIds = _.uniq(_.concat(debtorsIds, buyerId));

    const users = await this._db
      .collection("users")
      .find({
        id: { $in: usersIds }
      })
      .toArray();

    const debtors = users.filter(user => user.id !== buyerId);
    const [buyer] = users.filter(user => user.id === buyerId);
    const bulk = await this._db.collection("users").initializeUnorderedBulkOp();

    debtors.forEach(debtor => {
      // Обновляем баланс должника
      const updatedDebtor = _.update(
        debtor,
        ["balances", buyer.id],
        updateBalance(-debt)
      );
      bulk.find({ id: debtor.id }).updateOne({ $set: updatedDebtor });
      // Зеркально обновляем баланс кредитора
      const updatedBuyer = _.update(
        buyer,
        ["balances", debtor.id],
        updateBalance(debt)
      );
      bulk.find({ id: buyer.id }).updateOne({ $set: updatedBuyer });
    });

    await bulk.execute();
  }

  /**
   * Гасит задолженность
   * @param {Object} params
   * @param {string} params.debtorId - должник, тот кто гасит долг
   * @param {string} params.creditorId - кредитор, тот кому должны
   * @param {number} params.amount - на сколько рублей гасим долг
   */
  async payDebt({ debtorId, creditorId, amount }) {
    // TODO: проверить что creditorId и debtorId существуют

    if (!debtorId || !creditorId || !amount) {
      throw new ServiceError(
        "Не передан обязательный параметр debtorId, creditorId или amount"
      );
    }

    if (debtorId === creditorId) {
      throw new ServiceError("Нельзя погасить долг самому себе");
    }

    if (!_.isNumber(amount)) {
      throw new ServiceError("amount должен быть числом");
    }

    if (amount < 0) {
      throw new ServiceError("Нельзя погасить долг на отрицательную сумму");
    }

    const users = await this._db
      .collection("users")
      .find({
        id: { $in: [debtorId, creditorId] }
      })
      .toArray();

    const [debtor] = users.filter(user => user.id == debtorId);
    const [creditor] = users.filter(user => user.id === creditorId);

    const bulk = await this._db.collection("users").initializeUnorderedBulkOp();

    // Обновляем баланс должника
    const updatedDebtor = _.update(
      debtor,
      ["balances", creditor.id],
      updateBalance(amount)
    );
    bulk.find({ id: debtor.id }).updateOne({ $set: updatedDebtor });
    // Зеркально обновляем баланс кредитора
    const updatedCreditor = _.update(
      creditor,
      ["balances", debtor.id],
      updateBalance(-amount)
    );
    bulk.find({ id: creditor.id }).updateOne({ $set: updatedCreditor });

    await bulk.execute();
  }

  /**
   * Получает информацию о юзере по id
   * @param {string} id
   */
  async getUserInfo({ id }) {
    // TODO: кидать ошибку если юзера нет?
    const user = await this._db.collection("users").findOne({ id });

    return user;
  }

  async getUsers() {
    const users = await this._db
      .collection("users")
      .find({}, { id: 1, name: 1 })
      .project({ name: 1, id: 1, _id: 0 })
      .toArray();

    return users;
  }
}

module.exports = Service;
