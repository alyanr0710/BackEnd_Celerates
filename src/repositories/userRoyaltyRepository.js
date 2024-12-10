const { UserRoyalty } = require("../infrastructure/models");

class UserRoyaltyRepository {
  async create(userRoyalty) {
    return UserRoyalty.create(userRoyalty);
  }

  async update(userRoyalty) {
    return UserRoyalty.update(userRoyalty, {
      where: {
        user_id: userRoyalty.user_id,
      },
    });
  }

  async getUserRoyalty(userId) {
    return UserRoyalty.findOne({
      where: {
        user_id: userId,
      },
    });
  }
}

module.exports = UserRoyaltyRepository;
