'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.hasMany(models.ImageItem, {
        foreignKey: 'item_id', // Kolom yang digunakan di ImageItem untuk referensi ke Item
        as: 'images' // Alias yang digunakan saat mengakses gambar terkait
      });
      Item.belongsTo(models.Category, {
        foreignKey: 'category_id', // Kolom yang digunakan di Item untuk referensi ke Category
        as: 'category' // Alias yang digunakan saat mengakses kategori terkait
      });
      Item.hasMany(models.Flashsale, {
        foreignKey: 'item_id', // Kolom yang digunakan di Flashsale untuk referensi ke Item
        as: 'flashsale' // Alias yang digunakan saat mengakses flash sale terkait
      });
    }
  }
  Item.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    info: DataTypes.STRING,
    price: DataTypes.INTEGER, 
    strikeout_price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    count_sold: DataTypes.INTEGER,
    expiration_date: DataTypes.DATE,
    color: DataTypes.STRING,
    size: DataTypes.STRING,
    model: DataTypes.STRING,
    points: DataTypes.INTEGER,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};