const { Voucher } = require("../infrastructure/models");

class VoucherRepository {
  async getVoucherByCode(code) {
    return Voucher.findOne({
      where: {
        code,
      },
    });
  }

  async getVoucherByLevel(level) {
    return Voucher.findAll({
      where: {
        royalty_level: level,
      },
    });
  }
}

module.exports = VoucherRepository;
