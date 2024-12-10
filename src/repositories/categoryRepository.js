const { Category } = require("../infrastructure/models")

class CategoryRepository {
  async getById(id) {
    return await Category.findByPk(id);
  }

  async getAll() {
    return await Category.findAll();
  }
}

module.exports = CategoryRepository;
