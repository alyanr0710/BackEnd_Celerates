const { Address } = require("../infrastructure/models");
const { Op } = require("sequelize");

class AddressRepository {
    async createAddress(data) {
        return await Address.create(
            {
                address_name: data.address_name,
                address: data.address,
                phone_number: data.phone_number,
                user_id: data.user_id,
                recipient: data.recipient
            }
        );
    }

    async getAddressByUserId(userId) {
        return await Address.findAll({
            where: {
                user_id: userId,
            }
        });
    }

    async getAddressById(id) {
        return await Address.findOne({
            where: {
                id: id,
            }
        });
    }

    async updateAddress(data) {
        return await Address.update(
            {
                address_name: data.address_name,
                address: data.address,
                phone_number: data.phone_number,
                recipient: data.recipient
            },
            {
                where: {
                    id: data.id,
                },
                returning: true
            }
        );
    }

    async deleteAddress(id) {
        return await Address.destroy({
            where: {
                id: id,
            }
        });
    }
}

module.exports = AddressRepository;
