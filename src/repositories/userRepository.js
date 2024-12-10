const { User } = require("../infrastructure/models");

class UserRepository {
  async create(user) {
    return await User.create(user);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    return await user.update(data);
  }

  async updatePassword(id, password) {
    const user = await User.findByPk(id);
    return await user.update({ password });
  }

  async delete(id) {
    // update is_deleted menjadi true
    const user = await User.findByPk(id);
    return await user.update({ is_deleted: true });
  }
}

module.exports = UserRepository;
