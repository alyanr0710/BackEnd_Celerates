'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionItem.belongsTo(models.Transaction, {
        foreignKey: 'transaction_id',
        as: 'transaction'
      });
      TransactionItem.belongsTo(models.CartItem, {
        foreignKey: 'items_id',
        as: 'cartItem'
      });
    }
  }
  TransactionItem.init({
    transaction_id: DataTypes.INTEGER,
    items_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    amount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'TransactionItem',
  });
  return TransactionItem;
};