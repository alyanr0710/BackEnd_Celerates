const { UserVoucher } = require("../infrastructure/models");

class UserVoucherRepository {
  async getUserVoucherByUserId(userId) {
    // join UserVoucher with Voucher
    return UserVoucher.findAll({
      where: {
        user_id: userId,
      },
      include: {
        association: "voucher",
      },
    });
  }

  async getUserVoucherByVoucherCode(userId, code) {
    return UserVoucher.findOne({
      where: {
        user_id: userId,
      },
      include: {
        association: "voucher",
        where: {
          code,
        },
      },
    });
  }

  async batchCreateUserVoucher(userVouchers) {
    return UserVoucher.bulkCreate(userVouchers);
  }

  async updateUserVoucher(userId, voucherId) {
    return UserVoucher.update(
      {
        remaining: remaining - 1,
      },
      {
        where: {
          id: voucherId,
          user_id: userId,
        },
      }
    );
  }
}

module.exports = UserVoucherRepository;
