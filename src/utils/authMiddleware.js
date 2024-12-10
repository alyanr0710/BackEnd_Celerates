const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");

const authenticateToken = (req, res, next) => {
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


    req.user = user; // Simpan data user dari token ke `req.user`
    next(); // Lanjut ke handler berikutnya
  });
};

module.exports = authenticateToken;
