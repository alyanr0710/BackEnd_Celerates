class DeleteItem {
    constructor(itemRepository) {
      this.itemRepository = itemRepository;
    }
  
    async execute(id) {
      return await this.itemRepository.delete(id);
    }
  }
  
  module.exports = DeleteItem;
  