'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
      });
      Rating.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Rating.init({
    item_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};