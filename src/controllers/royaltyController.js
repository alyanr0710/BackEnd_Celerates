const UserRoyaltyRepository = require('../repositories/userRoyaltyRepository');


const Joi = require("joi");
const { check } = require('express-validator');

module.exports = {
    async getUserRoyalty(req, res) {
        try {
            const userRoyalty = new UserRoyaltyRepository();
            const userId = req.user.id;

            let userRoyaltyData = await userRoyalty.getUserRoyalty(userId);
            if (!userRoyaltyData) {
                // create new user royalty
                const newUserRoyalty = {
                    user_id: userId,
                    level: 0,
                    point: 0
                };

                await userRoyalty.create(newUserRoyalty);

                userRoyaltyData = await userRoyalty.getUserRoyalty(userId);
            }

            let level = "begginer";
            if (userRoyaltyData.point >= 15) {
                level = "platinum";
            } else if (userRoyaltyData.point >= 7) {
                level = "gold";
            } else if (userRoyaltyData.point >= 3) {
                level = "silver";
            }

            // hitung persentase ke level selanjutnya
            let nextLevel = 0 //in percent
            if (userRoyaltyData.point < 3) {
                nextLevel = userRoyaltyData.point / 3 * 100;
            } else if (userRoyaltyData.point < 7) {
                nextLevel = (userRoyaltyData.point - 3) / 4 * 100;
            } else if (userRoyaltyData.point < 15) {
                nextLevel = (userRoyaltyData.point - 7) / 8 * 100;
            }


            
            const data = {
                id: userRoyaltyData.id,
                level: level,
                percent: nextLevel,
                jumlah_transaksi: userRoyaltyData.point
            }

            res.json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
};
