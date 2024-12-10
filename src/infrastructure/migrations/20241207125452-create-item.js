'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
      info: {
        type: Sequelize.STRING
      },
      strikeout_price: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      price: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      stock: {
        type: Sequelize.INTEGER
      },
      category_id: {
        references: {
          model: 'Categories',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      count_sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      color : {
        type: Sequelize.STRING
      },
      size : {
        type: Sequelize.STRING
      },
      model : {
        type: Sequelize.STRING
      },
      expiration_date: {
        type: Sequelize.DATE
      },
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  }
};