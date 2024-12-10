require("dotenv").config();
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const authMiddleware = require("./utils/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const flashSaleRoutes = require("./routes/flashSaleRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addresRoutes = require("./routes/addressRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const royaltiRoutes = require("./routes/royaltyRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const userRoutes = require("./routes/userRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/flashsales', flashSaleRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/addresses", authMiddleware, addresRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/royalties", authMiddleware, royaltiRoutes);
app.use("/api/vouchers", authMiddleware, voucherRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ratings", authMiddleware, ratingRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
