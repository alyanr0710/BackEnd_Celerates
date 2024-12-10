const { hashPassword } = require("../../utils/hashHelper");

class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already registered.");
    }

    // cek jika email nya admin@gmail.com
    if (userData.email === 'admin@gmail.com') {
      userData.is_admin = true;
    }

    userData.password = await hashPassword(userData.password);
    userData.telp_number = "-";
    return await this.userRepository.create(userData);
  }
}

module.exports = RegisterUser;
