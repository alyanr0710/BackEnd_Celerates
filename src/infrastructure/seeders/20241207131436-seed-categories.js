"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Categories", // Nama tabel
      [
        {
          name: "Pakaian",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Makanan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kerajinan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
