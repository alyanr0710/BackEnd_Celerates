import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [emailNomorPonsel, setEmailNomorPonsel] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk menangani proses login
  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Log input yang dimasukkan pengguna
    console.log("User Input:", { emailNomorPonsel, password });
  
    if (!emailNomorPonsel || !password) {
      setError("Semua field wajib diisi.");
      console.log("Error: Semua field wajib diisi.");
      return;
    }
  
    setError("");
    setLoading(true);
    setSuccessMessage(""); 
    try {
      console.log("Sending login request...");
      const response = await axios.post("http://localhost:9050/login", {
        email_nomorponsel: emailNomorPonsel,
        password,
      });
  
      // Log respons dari server
      console.log("Response received:", response);
  
      // Pastikan response status dan token ada
      if (response.status === 200 && response.data.token) {
        console.log("Login berhasil, token diterima:", response.data.token);
        localStorage.setItem("token", response.data.token); 
        setSuccessMessage("Login berhasil!");
        setTimeout(() => {
          navigate("/home"); 
        }, 2000);
      } else {
        setError("Login gagal, silakan coba lagi.");
        console.log("Error: Login gagal, status:", response.status);
      }
    } catch (err) {
      // Log error
      console.error("Login error:", err);
  
      // Tampilkan pesan error dari backend atau pesan default
      if (err.response) {
        // Error dari response backend
        setError(err.response?.data?.message || "Login gagal.");
        console.log("Server responded with error:", err.response?.data);
      } else if (err.request) {
        // Error jika tidak ada respons dari server
        setError("Tidak dapat menghubungi server. Coba lagi nanti.");
        console.log("No response from server:", err.request);
      } else {
        // Error lainnya
        setError("Terjadi kesalahan. Coba lagi.");
        console.log("Unexpected error:", err.message);
      }
    } finally {
      setLoading(false); // Set loading ke false setelah API call selesai
      console.log("Finished login process.");
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {}
      <header className="bg-[#C62E2E] text-white p-4">
        <div className="text-lg font-bold">
          <p>CENTRAL</p>
          <p className="ml-3 font-ribeye">JAVA</p>
        </div>
      </header>

      {}
      <main className="flex-grow flex justify-center items-center py-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {}
          <div className="bg-red-100 p-10 rounded-lg w-[350px] text-center">
            <h2 className="text-xl font-semibold mb-4">Selamat Datang Kembali!</h2>
            <p className="mb-6">
              Belum punya akun?{" "}
              <Link to="/register" className="font-bold italic text-red-600 hover:underline">
                Daftar
              </Link>
            </p>

            {}
            {error && <div className="text-red-600 mb-4">{error}</div>}

            {}
            {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Masukkan email atau nomor ponsel"
                value={emailNomorPonsel}
                onChange={(e) => setEmailNomorPonsel(e.target.value)}
                className="w-full p-2 border-red-600 border rounded-[15px] mb-4"
                required
              />
              <input
                type="password"
                placeholder="Masukkan sandi anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-red-600 border rounded-[15px] mb-4"
                required
              />
              <Link to="/forget-password" className="block text-right text-sm text-black hover:underline">
                Lupa Kata Sandi?
              </Link>

              <button
                type="submit"
                className="w-full text-center bg-[#C62E2E] text-white py-2 rounded font-bold hover:bg-red-700 mt-4"
                disabled={loading}
              >
                {loading ? "Sedang Memuat..." : "Masuk"}
              </button>
            </form>

            {}
            <div className="mt-6 text-sm">atau masuk dengan</div>
            <div className="flex items-center mt-6">
              <span className="flex-grow h-[1px] bg-black"></span>
              <a href="googlelogin.html" className="mx-4" aria-label="Login with Google">
                <img src="/assets/images/google-icon.png" alt="Google" className="w-8 h-8" />
              </a>
              <span className="flex-grow h-[1px] bg-black"></span>
            </div>
          </div>

          {}
          <div className="text-center">
            <img src="/assets/images/fotologin.png" alt="Foto Login" className="w-[300px] mb-4" />
            <h2 className="text-black mt-4 font-semibold">Masuk dan Mulai Belanja!</h2>
            <p className="text-gray-600">Kami menghadirkan beragam produk unggulan</p>
            <p className="text-gray-600">dari Jawa Tengah.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
