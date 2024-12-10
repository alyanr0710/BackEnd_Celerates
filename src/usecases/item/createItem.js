class CreateItem {
    constructor(itemRepository) {
      this.itemRepository = itemRepository;
    }
  
    async execute(itemData, imageUrls) {
      return await this.itemRepository.create(itemData, imageUrls);
    }
  }
  
  module.exports = CreateItem;
  