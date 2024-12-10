class User {
    constructor({ id, name, email, password, address, telp_number, is_admin }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.telp_number = telp_number;
      this.is_admin = is_admin;
    }
  }
  module.exports = User;
  