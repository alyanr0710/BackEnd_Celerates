'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserVoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserVoucher.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      UserVoucher.belongsTo(models.Voucher, {
        foreignKey: 'voucher_id',
        as: 'voucher'
      });
    }
  }
  UserVoucher.init({
    user_id: DataTypes.INTEGER,
    voucher_id: DataTypes.INTEGER,
    remaining: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserVoucher',
  });
  return UserVoucher;
};