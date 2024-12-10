class UpdateItem {
    constructor(itemRepository) {
      this.itemRepository = itemRepository;
    }
  
    async execute(id, updateData, imageUrls) {
      return await this.itemRepository.update(id, updateData, imageUrls);
    }
  }
  
  module.exports = UpdateItem;
  