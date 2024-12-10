const UserRepository = require("../repositories/userRepository");
const { hashPassword, comparePassword } = require("../utils/hashHelper");

const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Set up multer storage configuration
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage }).single("image");

const userRepository = new UserRepository();
const joi = require("joi");

module.exports = {
  async getProfileWithImage(req, res) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Membaca file image dari direktori uploads
      let profileImage = "http://localhost:3000/uploads/profile_" + user.id + ".png";
      // cek apakah file ada
      if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + user.id + '.png'))) {
        profileImage = "http://localhost:3000/uploads/profile_" + user.id + ".jpg";
        if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + user.id + '.jpg'))) {
          profileImage = "http://localhost:3000/uploads/profile_" + user.id + ".jpeg";
          if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + user.id + '.jpeg'))) {
            profileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
          }
        }       
      }

      return res.status(200).json({
        status: "success",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          telp_number: user.telp_number,
          profile_image: profileImage
        }
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        telp_number: joi.string().required()
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const data = {
        id: req.user.id,
        name: req.body.name,
        email: req.body.email,
        telp_number: req.body.telp_number
      };

      const user = await userRepository.update(req.user.id, req.body);
      return res.status(200).json({
        message: "User updated",
        data,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async updateProfileImage(req, res) {
    try {
      // Menangani upload file dengan multer
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
  
        if (!req.file) {
          return res.status(400).json({ message: 'Image is required' });
        }
  
        // Mendapatkan ekstensi file dan menghasilkan nama file
        const ext = path.extname(req.file.originalname);
        const filename = `profile_${req.user.id}${ext}`;
  
        // Path untuk direktori upload di root proyek
        const uploadPath = path.join(__dirname, '../../uploads'); // Membuat path menuju direktori uploads
        const filePath = path.join(uploadPath, filename); // File path lengkap
  
        // Memastikan direktori upload ada
        if (!fs.existsSync(uploadPath)) {
          // Membuat direktori jika belum ada
          fs.mkdirSync(uploadPath, { recursive: true });
        }
  
        // Menyimpan file ke path yang ditentukan
        fs.writeFileSync(filePath, req.file.buffer);
  
        // Mengirim respons sukses
        return res.status(200).json({ message: 'Profile image updated successfully' });
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async updatePassword(req, res) {
    try {
      const schema = joi.object({
        old_password: joi.string().required(),
        new_password: joi.string().min(6).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await comparePassword(req.body.old_password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const hashedPassword = await hashPassword(req.body.new_password);
      await userRepository.updatePassword(req.user.id, hashedPassword);

      return res.status(200).json({ message: 'Password updated' });
    }
    catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  async deleteProfile(req, res) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await userRepository.delete(req.user.id);
      return res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // reset password function menerima email , otp, password baru
  async resetPassword(req, res) {
    try {
      const schema = joi.object({
        email: joi.string().email().required(),
        otp: joi.string().required(),
        new_password: joi.string().min(6).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // cek apakah email ada di database
      const user = await userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // cek apakah otp valid
      const env_otp = process.env.OTP;
      if (env_otp !== req.body.otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // hash password baru
      const hashedPassword = await hashPassword(req.body.new_password);
      await userRepository.updatePassword(user.id, hashedPassword);

      return res.status(200).json({ message: 'Password updated' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // cek otp
  async cekOtp(req, res) {
    try {
      const schema = joi.object({
        otp: joi.string().required()
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      
      // cek apakah otp valid
      const env_otp = process.env.OTP;
      if (env_otp !== req.body.otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      return res.status(200).json({ message: 'OTP valid' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // cek email
  async cekEmail(req, res) {
    try {
      const schema = joi.object({
        email: joi.string().email().required()
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // cek apakah email ada di database
      const user = await userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Email valid' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

};
