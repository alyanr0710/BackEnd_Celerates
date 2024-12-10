class ReadItem {
    constructor(itemRepository) {
      this.itemRepository = itemRepository;
    }
  
    async execute(filters) {
      const { filterBy } = filters;
      let order = [];
      let take = Math.min(filters.take || 10, 100);
  
      // Tentukan urutan berdasarkan filterBy
      if (filterBy === "date_desc") {
        order = [["createdAt", "DESC"]];
      } else if (filterBy === "date_asc") {
        order = [["createdAt", "ASC"]];
      } else if (filterBy === "price_asc") {
        order = [["price", "ASC"]];
      } else if (filterBy === "price_desc") {
        order = [["price", "DESC"]];
      } else if (filterBy === "popular") {
        order = [["points", "DESC"]];
      }
  
      // Tentukan filter berdasarkan harga dan tanggal jika ada
      const where = {};
      if (filters.minPrice) where.price = { [Op.gte]: filters.minPrice };
      if (filters.maxPrice) where.price = { ...where.price, [Op.lte]: filters.maxPrice };
      if (filters.startDate) where.createdAt = { [Op.gte]: filters.startDate };
      if (filters.endDate) where.createdAt = { ...where.createdAt, [Op.lte]: filters.endDate };

      const categoryId = filters.categoryId;
      const search = filters.search;
  
      return await this.itemRepository.findAll(where, order, categoryId, search, take);
    }
  }
  
  module.exports = ReadItem;
  