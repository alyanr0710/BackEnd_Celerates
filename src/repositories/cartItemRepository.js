const { CartItem } = require("../infrastructure/models");
const { Op } = require("sequelize");

class CartItemRepository {
    async addCartItem(cartId, itemId, qty) {
        return await CartItem.create(
            {
                cart_id: cartId,
                item_id: itemId,
                qty: qty,
            },
            { returning: true }
        );
    }

    // update qty of cart item
    async updateCartItem(cartItemId, qty) {
        return await CartItem.update(
            {
                qty: qty,
            },
            {
                where: {
                    id: cartItemId,
                    isHidden: false,
                },
                returning: true,
            }
        );
    }

    async getCartItemByCartItemId(cartItemId) {
        return await CartItem.findByPk(cartItemId, {
            include: {
                association: "item",
                attributes: ["id", "stock"],
            },
            where: {
                isHidden: false,
            },
        });
    }

    // get cart item by cart id and item id
    async getCartItemByCartIdAndItemId(cartId, itemId) {
        return await CartItem.findOne({
            where: {
                [Op.and]: [{ cart_id: cartId }, { item_id: itemId }],
                isHidden: false,
            },
        });
    }

    async getCartItemsByCartId(cartId) {
        return await CartItem.findAll({
            where: {
                cart_id: cartId,
                isHidden: false,
            },
            include: {
                association: "item",
                attributes: ["name", "price"],
            }
        });
    }

    // findById
    async findById(id) {
        return await CartItem.findOne({
            where: {
                id: id,
                isHidden: false,
            },
        });
    }

    // delete cart item
    async deleteCartItem(id) {
        return await CartItem.destroy({
            where: {
                id: id,
                isHidden: false,
            },
        });
    }

    // delete cart by item id
    async deleteCartItemByItemId(itemId) {
        // update isHidden to true
        return await CartItem.update(
            {
                isHidden: true,
            },
            {
                where: {
                    id: itemId,
                    isHidden: false,
                },
            }
        );
    }

    // get hidden cart item by user id
    async getHiddenCartItemByUserId(userId) {
        return await CartItem.findAll({
            where: {
                isHidden: true,
            },
            attributes: ["id", "item_id"],
            include: {
                association: "cart",
                where: {
                    user_id: userId,
                },
                attributes: [],
            },
            include: {
                association: "item",
                attributes: ["name"],
            },
        });
    }
}

module.exports = CartItemRepository;
