class CreateTransactionItems {
    constructor(transactionItemRepository) {
        this.transactionItemRepository = transactionItemRepository;
    }
    
    async execute(transactionItems) {
        return await this.transactionItemRepository.bulkCreate(transactionItems);
    }
}

module.exports = CreateTransactionItems;
