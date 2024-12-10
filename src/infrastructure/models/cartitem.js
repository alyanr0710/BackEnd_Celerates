'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // Relation to Cart
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cart_id',
        as: 'cart', // Alias untuk keranjang
      });

      // Relation to Item
      CartItem.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item', // Alias untuk item
      });
    }
  }

  CartItem.init(
    {
      cart_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      isHidden: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'CartItem',
    }
  );

  return CartItem;
};
