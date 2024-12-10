'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Flashsale extends Model {
    static associate(models) {
      Flashsale.belongsTo(models.Item, {
        foreignKey: 'item_id', // Kolom yang menghubungkan Flashsale ke Item
        as: 'item' // Alias yang digunakan saat mengakses data terkait
      });
    }
  }

  Flashsale.init({
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items', // Nama tabel di database untuk model Item
        key: 'id', // Kolom yang digunakan sebagai foreign key
      },
    },
    flash_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Flashsale',
    timestamps: true, // Sesuaikan apakah Anda memerlukan createdAt dan updatedAt
  });

  return Flashsale;
};
