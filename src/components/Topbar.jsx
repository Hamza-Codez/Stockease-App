import { Search, User } from "lucide-react"; 
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Topbar = ({ onSearch, searchType = "products" }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const [debouncedValue, setDebouncedValue] = useState('');

  // Dynamic placeholder based on search type
  const placeholderText = searchType === "products" 
    ? "Search products..." 
    : "Search customers...";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchInput);
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    const storedUser = localStorage.getItem("adminId");
    if (storedUser) {
      setUser(storedUser);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logOutUser = () => {
    localStorage.removeItem("adminId");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="w-full h-[70px] border-b-[1px] border-[#17BCBE] flex justify-between items-center px-[16px] py-[16px] bg-white">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center bg-[#E8F8F9] w-[430px] h-[42px] px-[10px] py-[8px] rounded-lg border-[1px] border-[#20dbdf]">
          <Search size={20} className="absolute left-[10px] text-[#17BCBE]" />
          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            className="w-full h-full pl-[30px] pr-[16px] py-[4px] rounded-lg border-0 outline-none text-[#108587]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="absolute right-2 font-bold text-[#17BCBE] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Right Section (Profile Dropdown) */}
      <div className="relative" ref={dropdownRef}>
        <button
          className={`flex items-center gap-2 p-2 rounded-md transition cursor-pointer 
            ${isDropdownOpen ? "bg-[#108587] text-white" : "bg-[#E8F8F9] text-[#108587] hover:bg-[#108587] hover:text-white"}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <User size={20} />
          <span className="hidden sm:block">{user ? "Admin" : "Guest"}</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-[#17BCBE] rounded-lg shadow-lg">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-[#E8F8F9] cursor-pointer text-[#108587]">Profile</li>
              {user ? (
                <li
                  onClick={logOutUser}
                  className="px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                >
                  Logout
                </li>
              ) : (
                <Link to="/login">
                  <li className="px-4 py-2 text-green-500 hover:bg-green-100 cursor-pointer">
                    Login
                  </li>
                </Link>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;