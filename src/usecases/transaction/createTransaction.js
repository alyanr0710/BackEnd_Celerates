class CreateTransaction {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    
    async execute(transactionData) {
        return await this.transactionRepository.create(transactionData);
    }
}

module.exports = CreateTransaction;
