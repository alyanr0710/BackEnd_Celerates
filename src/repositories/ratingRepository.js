const { Rating } = require("../infrastructure/models");

class RatingRepository {
  async createRating(data) {
    return Rating.create(data);
  }

  async getRatingByItemId(itemId) {
    return Rating.findAll({
      where: {
        item_id: itemId,
      },
      include: {
        association: "user",
        attributes: ["id", "name", "email"],
      },
    });
  }

  async getRatingByItemIdFilterRating(itemId, rating) {
    return Rating.findAll({
      where: {
        item_id: itemId,
        rating: rating,
      },
      include: {
        association: "user",
        attributes: ["id", "name", "email"],
      },
    });
  }

  async getAllRatings() {
    return Rating.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
        }
      ],
    });
  }

  async getAllRatingWithLimit(limit) {
    return Rating.findAll({
      limit: limit,
      include: {
        association: "user",
        attributes: ["id", "name", "email"],
      },
    });
  }

  async getRatingByItemIdAndUserId(itemId, userId) {
    return Rating.findOne({
      where: {
        item_id: itemId,
        user_id: userId,
      },
    });
  }
}

module.exports = RatingRepository;
