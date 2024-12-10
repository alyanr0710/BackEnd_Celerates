const bcrypt = require("bcryptjs");

module.exports = {
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  },

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },
};
