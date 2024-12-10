const { Flashsale } = require('../infrastructure/models');
const { Op } = require('sequelize');

class FlashSaleRepository {
  async create(flashSale) {
    return await Flashsale.create(flashSale);
  }

  async findAllActive() {
    return await Flashsale.findAll({
      where: {
        start_time: {
          [Op.lte]: new Date(),
        },
        end_time: {
          [Op.gte]: new Date(),
        },
      },
      order: [
        ['end_time', 'ASC'],
        ['start_time', 'ASC'],
      ],
      include: {
        association: 'item',
        attributes: ['name', 'price', "rating"],
        include: {
          association: 'images',
          attributes: ['url'],
        },
      }
    });
  }

  async findAll() {
    return await Flashsale.findAll();
  }

  async findById(id) {
    return await Flashsale.findByPk(id);
  }

  async update(id, flashSale) {
    return await Flashsale.update(flashSale, { where: { id } });
  }

  async delete(id) {
    return await Flashsale.destroy({ where: { id } });
  }
}

module.exports = FlashSaleRepository;
