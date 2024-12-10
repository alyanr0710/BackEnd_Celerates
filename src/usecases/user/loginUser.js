const { comparePassword } = require("../../utils/hashHelper");
const { generateToken } = require("../../utils/jwtHelper");

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    // cek jika user is deleted
    if (user.is_deleted) {
      throw new Error("User has been deleted.");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    });

    return { user, token };
  }
}

module.exports = LoginUser;
