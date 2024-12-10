const { Transaction } = require("../infrastructure/models");

const Sequelize = require('sequelize');

class TransactionRepository {
  async create(data) {
    return await Transaction.create(data);
  }

  async findById(id) {
    // sama get relasi ke transaction item
    return await Transaction.
      findByPk(id, {
        include: [
          {
            association: 'transactionItems',
            attributes: ['qty', 'amount', 'items_id'],
            include: [
              {
                association: 'cartItem',
                attributes: ['item_id'],
                include: [
                  {
                    association: 'item',
                    attributes: ['name'],
                    include: [
                      {
                        association: 'images',
                        attributes: ['url']
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            association: 'user',
            attributes: ['name', 'email', 'telp_number']
          }
        ]
      });
  }

  async findByUserId(userId) {
    return await Transaction.findAll({
      where: {
        userId: userId
      },
      attributes: ['id', 'status', 'orderID', 'payment_method', 'payment_url', 'amount', 'address', 'total_amount'],
      include: {
        association: 'transactionItems',
        attributes: ['qty', 'amount', "items_id"],
        include: {
          association: 'cartItem',
          attributes: ['item_id'],
          include: {
            association: 'item',
            attributes: ['name'],
            include: {
              association: 'images',
              attributes: ['url']
            }
          }
        }
      }
    });
  }

  async getAll(start_date, end_date) {
    // Membuat kondisi where untuk tanggal
    const whereCondition = {};
  
    if (start_date) {
      whereCondition.createdAt = {
        [Sequelize.Op.gte]: new Date(start_date), // Greater than or equal to start_date
      };
    }
  
    if (end_date) {
      whereCondition.createdAt = {
        ...whereCondition.createdAt, // Menambahkan kondisi sebelumnya jika ada
        [Sequelize.Op.lte]: new Date(end_date), // Less than or equal to end_date
      };
    }
  
    return await Transaction.findAll({
      attributes: ['id', 'status', 'orderID', 'payment_method', 'payment_url', 'amount', 'address', 'total_amount', 'createdAt'],
      where: whereCondition, // Menambahkan kondisi where
      include: [
        {
          association: 'transactionItems',
          attributes: ['qty', 'amount', 'items_id'],
          include: [
            {
              association: 'cartItem',
              attributes: ['item_id'],
              include: [
                {
                  association: 'item',
                  attributes: ['name'],
                }
              ]
            }
          ]
        },
        {
          association: 'user',
          attributes: ['name', 'email', 'telp_number']
        }
      ]
    });
  }
  
  


  async update(id, data) {
    return await Transaction.update(data, {
      where: {
        id: id
      }
    });
  }

  async updateStatus(id, status) {
    return await Transaction.update({
      status: status
    }, {
      where: {
        id: id
      }
    });
  }
}

module.exports = TransactionRepository;
