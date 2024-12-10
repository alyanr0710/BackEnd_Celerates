const { TransactionItem } = require("../infrastructure/models");

class TransactionItemRepository {
  async bulkCreate(data) {
    return await TransactionItem.bulkCreate(data);
  }

  // findByTransactionId
  async findByTransactionId(transactionId) {
    return await TransactionItem.findAll({
      where: {
        transaction_id: transactionId
      }
    });
  }
}

module.exports = TransactionItemRepository;
