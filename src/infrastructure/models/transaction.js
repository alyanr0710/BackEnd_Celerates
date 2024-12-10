'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.hasMany(models.TransactionItem, {
        foreignKey: 'transaction_id',
        as: 'transactionItems'
      });
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  Transaction.init({
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    orderID: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_url: DataTypes.STRING,
    voucher_id: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    address: DataTypes.STRING,
    total_amount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};