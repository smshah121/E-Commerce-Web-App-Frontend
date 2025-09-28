import React, { useState, useRef, useEffect } from 'react';
import { useGetCurrentUserQuery } from '../../feature/user/userApi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WelcomeBanner = () => {
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const role = user?.role || "User";
  const name = user?.name || "User";

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/my-profile');
  };

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg mb-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            👋 Welcome back, {name}!
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-1">
            Here’s your <span className="font-semibold">{role.toLowerCase()}</span> dashboard overview.
          </p>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition duration-300"
          >
            ⚙️ Options
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-20"
            >
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
