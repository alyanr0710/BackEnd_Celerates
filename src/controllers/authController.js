const UserRepository = require("../repositories/userRepository");
const RegisterUser = require("../usecases/user/registerUser");
const LoginUser = require("../usecases/user/loginUser");

const userRepository = new UserRepository();
const joi = require("joi");
const jwt = require("jsonwebtoken");

module.exports = {
  async register(req, res) {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const registerUser = new RegisterUser(userRepository);
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        telp_number: "-",
      };
      const user = await registerUser.execute(data);
      return res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const loginUser = new LoginUser(userRepository);
      const { email, password } = req.body;
      const { user, token } = await loginUser.execute({ email, password });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin,
        },
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async checkToken(req, res) {
    const authHeader = req.headers["authorization"]; // Ambil token dari header
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(403).json(
        {
          "status": "unauthenticated",
          "message": "No token provided"
        }
      );
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json(
          {
            "status": "unauthenticated",
            "message": "Token is not valid"
          }
        );
      }
      // cek apakah user ada di database
      let repo = new UserRepository();
      const userExist = await repo.findById(user.id);
      if (!userExist) {
        return res.status(403).json(
          {
            "status": "unauthenticated",
            "message": "Token is not valid"
          }
        );
      }

      // cek jika user is deleted
      if (userExist.is_deleted) {
        return res.status(403).json(
          {
            "status": "unauthenticated",
            "message": "User has been deleted."
          }
        );
      }

      // cek email nya sama
      if (userExist.email !== user.email) {
        return res.status(403).json(
          {
            "status": "unauthenticated",
            "message": "Token is not valid"
          }
        );
      }


      return res.status(200).json({
        status: "authenticated",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin,
        }
      });
    });
  }
};
