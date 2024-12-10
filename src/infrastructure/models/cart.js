'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Relation to User
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Alias user untuk keterbacaan
      });

      // Relation to CartItems
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cart_id',
        as: 'cartItems', // Alias snake_case untuk konsistensi
      });
    }
  }

  Cart.init(
    {
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );

  return Cart;
};
