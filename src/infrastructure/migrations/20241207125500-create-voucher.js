'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      royalty_level: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      name: {
        type: Sequelize.STRING
      },
      disc_type: {
        type: Sequelize.STRING
      },
      min_expense: {
        type: Sequelize.FLOAT
      },
      type: {
        type: Sequelize.ENUM('persen', 'nominal', 'ongkir')
      },
      disc: {
        type: Sequelize.FLOAT
      },
      code: {
        type: Sequelize.STRING,
        unique: true
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
    await queryInterface.dropTable('Vouchers');
  }
};