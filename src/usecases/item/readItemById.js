class ReadItemById {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }

    async execute(id) {
        const item = await this.itemRepository.findById(id);
        if (!item) {
            throw new Error("Item not found");
        }

        return item;
    }
}

module.exports = ReadItemById;
  