const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 9050;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Middleware to ensure database connection
db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err);
        process.exit(1); // Exit process if database connection fails
    }
    console.log('Terhubung ke database');
});

// Endpoint Registrasi
app.post('/register', async (req, res) => {
    const { email_nomorponsel, password, confirm_password } = req.body;

    if (!email_nomorponsel || !password || !confirm_password) {
        return res.status(400).json({ message: 'Semua kolom wajib diisi' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Password tidak cocok' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(email_nomorponsel);
    const isPhone = /^\d{10,15}$/.test(email_nomorponsel);
    if (!isEmail && !isPhone) {
        return res.status(400).json({ message: 'Email atau nomor ponsel tidak valid' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO register (email_nomorponsel, password) VALUES (?, ?)';
        db.query(sql, [email_nomorponsel, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email atau nomor ponsel sudah terdaftar' });
                }
                console.error('Error registrasi:', err);
                return res.status(500).json({ message: 'Gagal registrasi' });
            }
            res.status(201).json({ message: 'Registrasi berhasil' });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

app.post('/login', async (req, res) => {
    const { email_nomorponsel, password } = req.body;
    console.log('Request body:', req.body);

    const isEmail = /\S+@\S+\.\S+/.test(email_nomorponsel);
    const isPhone = /^\d{10,15}$/.test(email_nomorponsel);
    if (!isEmail && !isPhone) {
        return res.status(400).json({ message: 'Email atau nomor ponsel tidak valid' });
    }

    const sql = 'SELECT * FROM register WHERE email_nomorponsel = ?';
    db.query(sql, [email_nomorponsel], async (err, result) => {
        console.log('Query result:', result);

        if (err) {
            console.error('Error pada query login:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        const user = result[0];
        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id_user, email_nomorponsel: user.email_nomorponsel },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        console.log('Token generated:', token);
        res.status(200).json({ message: 'Login berhasil', token });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
