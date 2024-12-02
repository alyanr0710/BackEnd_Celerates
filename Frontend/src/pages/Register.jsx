import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const Register = () => {
  const [emailNomorPonsel, setEmailNomorPonsel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);  // State for modal
  const [modalMessage, setModalMessage] = useState("");  // Message to show in the modal
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    // Validasi form
    if (!emailNomorPonsel || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(emailNomorPonsel);
    const isPhoneNumber = /^\d{10,15}$/.test(emailNomorPonsel);

    if (!isEmail && !isPhoneNumber) {
      setError("Masukkan email atau nomor ponsel yang valid.");
      return;
    }

    try {
      const response = await axios.post(" http://localhost:9050/register", {
        email_nomorponsel: emailNomorPonsel,
        password,
        confirm_password: confirmPassword,
      });

      if (response.status === 201) {
        setModalMessage("Pendaftaran berhasil! Silakan login.");
        setShowModal(true);  
        setTimeout(() => {
          navigate("/login");
        }, 3000); 
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registrasi gagal, coba lagi.";
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header className="bg-[#C62E2E] text-white p-4">
        <div className="text-lg font-bold">
          <p>CENTRAL</p>
          <p className="ml-3 font-ribeye">JAVA</p>
        </div>
      </header>

      {/* Modal Popup for Success Message */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-red-500 font-semibold">{modalMessage}</h3> {}
          </div>
        </div>
      )}

      <div className="flex justify-center items-center flex-1 px-4 mt-10 mb-20">
        <div className="bg-red-100 p-8 rounded-lg shadow-lg mr-12 w-80">
          <h2 className="text-black text-center text-lg mb-4 font-semibold">
            Buat Akun Barumu yuk!
          </h2>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          <form onSubmit={handleRegister}>
            <input
              placeholder="Email/nomor ponsel"
              type="text"
              value={emailNomorPonsel}
              onChange={(e) => setEmailNomorPonsel(e.target.value)}
              className="w-full p-2 mb-2 border border-red-600 rounded-[15px]"
            />
            <input
              placeholder="Masukkan kata sandi baru"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-2 border border-red-600 rounded-[15px]"
            />
            <input
              placeholder="Masukkan konfirmasi kata sandi"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-red-600 rounded-[15px]"
            />
            <button
              type="submit"
              className="w-full text-center bg-[#C62E2E] text-white py-2 rounded font-bold hover:bg-red-700 mt-4"
            >
              Daftar
            </button>
          </form>

          {/* Login dengan Google */}
          <div className="mt-6 text-sm text-center">atau daftar dengan</div>
          <div className="flex justify-center items-center mt-6">
            <span className="flex-grow h-[1px] bg-black"></span>
            <a href="googlelogin.html" className="mx-4" aria-label="Daftar dengan Google">
              <img src="/assets/images/google-icon.png" alt="Google" className="w-8 h-8" />
            </a>
            <span className="flex-grow h-[1px] bg-black"></span>
          </div>
        </div>

        {/* Bagian Gambar */}
        <div className="text-center">
          <img
            src="/assets/images/fotologin.png"
            alt="Foto Register"
            className="w-[300px] mb-4"
          />
          <h2 className="text-black mt-4 font-semibold">Daftar dan Mulai Belanja!</h2>
          <p className="text-gray-600">Kami menghadirkan beragam produk unggulan</p>
          <p className="text-gray-600">dari Jawa Tengah.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
