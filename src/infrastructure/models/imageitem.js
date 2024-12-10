'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ImageItem.belongsTo(models.Item, {
        foreignKey: 'item_id', // Kolom yang menghubungkan ImageItem ke Item
        as: 'item' // Alias yang digunakan saat mengakses data terkait (bisa disesuaikan)
      });
    }
  }
  ImageItem.init({
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items', // Nama tabel di database untuk model Item
        key: 'id' // Kolom yang digunakan sebagai foreign key
      }
    },
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ImageItem',
  });
  return ImageItem;
};