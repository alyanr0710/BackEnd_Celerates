class getAllCategory {
    constructor({ categoryRepository }) {
      this._categoryRepository = categoryRepository;
    }
  
    async execute() {
      return this._categoryRepository.getAll();
    }
  }

module.exports = getAllCategory;
  