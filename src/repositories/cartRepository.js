const { Cart } = require("../infrastructure/models");
const { Op } = require("sequelize");

class CartRepository {
    async createCart(userId) {
        return await Cart.create(
            {
                user_id: userId,
            },
            { returning: true }
        );
    }

    async getCartByUserId(userId) {
        return await Cart.findOne({
            where: {
                user_id: userId,
            },
            include: {
                association: "cartItems",
                attributes: ["id","qty"],
                where: {
                    isHidden: false,
                },
                include: {
                    association: "item",
                    attributes: ["id", "name", "price"],
                    include: {
                        association: "images",
                        attributes: ["url"],
                    }
                }
            }
        });
    }
}

module.exports = CartRepository;
