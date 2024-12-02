import React, { useState } from "react";
import { Link } from "react-router-dom";
import CategoryDropdown from "./CategoryDropdown";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim() !== "") {
      console.log("Searching for:", searchTerm);
    }
  };

  return (
    <header className="bg-[#C62E2E] text-white p-4 flex justify-between items-center fixed top-0 w-full z-10 border-b-2 border-gray-300">
      <div className="logo text-xl font-bold font-ribeye flex-shrink-0 pl-5 flex flex-col justify-center items-center">
        <span>CENTRAL</span>
        <span>JAVA</span>
      </div>

      <nav className="nav flex space-x-4 items-center ml-20">
        <Link to="/home" className="">
          Home
        </Link>
        <CategoryDropdown />
      </nav>

      <div className="search-bar flex-grow flex items-center bg-white rounded-[15px] pl-3 pr-2 py-1 mx-auto w-full max-w-xl">
        <i className="fas fa-search text-gray-600 cursor-pointer text-2xl" onClick={handleSearchSubmit}></i>
        <input type="text" placeholder="Cari Produk..." value={searchTerm} onChange={handleSearchChange} className="search-input w-full px-2 py-1 rounded-[15px] focus:outline-none text-black" />
      </div>

      <nav className="nav flex space-x-10 items-center ml-auto">
        <Link to="/keranjang" className="keranjang00 text-white text-3xl">
          <i className="fas fa-shopping-cart"></i>
        </Link>

        <ProfileDropdown />
      </nav>
    </header>
  );
};

export default Header;
