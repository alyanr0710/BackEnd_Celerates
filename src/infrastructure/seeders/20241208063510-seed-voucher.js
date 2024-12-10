"use strict";

const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Data seeder
    const vouchers = [];

    const royaltyLevels = [
      { level: 0, discType: "nominal", maxDiscount: 5000 },
      { level: 1, discType: "nominal", maxDiscount: 10000 },
      { level: 2, discType: "persen", maxDiscount: 15 },
      { level: 3, discType: "persen", maxDiscount: 20 },
      { level: 4, discType: "ongkir", maxDiscount: 10000 },
    ];

    royaltyLevels.forEach((royalty) => {
      for (let i = 1; i <= 3; i++) {
        vouchers.push({
          royalty_level: royalty.level,
          name: `Voucher ${royalty.level} - ${i} ${
            royalty.discType === "nominal"
              ? "Potongan Harga"
              : royalty.discType === "persen"
              ? "Diskon Persen"
              : "Gratis Ongkir"
          }`,
          disc_type: royalty.discType,
          min_expense: 50000 / (royalty.level + 1), // Semakin tinggi level, min_expense semakin kecil
          type: royalty.discType === "nominal" ? "nominal" : royalty.discType,
          disc:
            royalty.discType === "nominal"
              ? royalty.maxDiscount
              : royalty.discType === "persen"
              ? royalty.maxDiscount
              : 0,
          code: `LOYALTI${royalty.level}${Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Insert data ke database
    await queryInterface.bulkInsert("Vouchers", vouchers, {});
  },

  async down(queryInterface, Sequelize) {
    // Hapus data sesuai pola kode
    await queryInterface.bulkDelete("Vouchers", {
      code: {
        [Op.like]: "LOYALTI%",
      },
    });
  },
};
