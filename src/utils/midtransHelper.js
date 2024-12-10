const midtransClient = require("midtrans-client");
require("dotenv").config();

// Setup Midtrans
const midtrans = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true", // Sesuaikan dengan environment
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

/**
 * Membuat tagihan QRIS
 * @param {string} orderId - ID unik untuk pesanan
 * @param {number} amount - Jumlah tagihan yang harus dibayar
 * @returns {object} - Response dari Midtrans API yang berisi link QR dan URL pembayaran
 */
const createQrisInvoice = async (orderId, amount) => {
  const chargeRequest = {
    payment_type: "qris",
    transaction_details: {
      order_id: orderId,
      gross_amount: amount, // Total tagihan
    },
    qris: {
      // QRIS specific config (bisa diatur sesuai kebutuhan)
    },
  };

  try {
    const chargeResponse = await midtrans.charge(chargeRequest);
    if (chargeResponse.status_code !== "201") {
      throw new Error(`Failed to create QRIS invoice: ${chargeResponse.status_message}`);
    }

    console.log("LOG MIDTRANS : ", chargeResponse);
    const expireTime = new Date(chargeResponse.expiry_time).getTime() - new Date().getTime();

    return {
      status: "success",
      message: "QRIS invoice created successfully",
      qr_url: chargeResponse.actions[0].url, // URL untuk QR Code
      payment_url: chargeResponse.redirect_url, // URL untuk pembayaran
      order_id: orderId,
      expiry_in_minutes: Math.floor(expireTime / 60000),
    };
  } catch (error) {
    throw new Error(`Error creating QRIS invoice: ${error.message}`);
  }
};

/**
 * Mengecek status pembayaran dari Midtrans
 * @param {string} orderId - ID pesanan untuk cek statusnya
 * @returns {object} - Status pembayaran
 */
const checkPaymentStatus = async (orderId) => {
  try {
    const statusResponse = await midtrans.transaction.status(orderId);
    console.log("LOG MIDTRANS : ", statusResponse);
    return statusResponse;
  } catch (error) {
    throw new Error(`Error checking payment status: ${error.message}`);
  }
};

module.exports = {
  createQrisInvoice,
  checkPaymentStatus,
};
