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
  className="relative bg-black text-white p-6 rounded-2xl shadow-md border border-neutral-800 mb-10"
>
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        👋 Welcome back, {name}!
      </h2>
      <p className="text-sm md:text-base text-neutral-400 mt-1 font-light">
        Here’s your <span className="font-semibold text-white">{role.toLowerCase()}</span> dashboard overview.
      </p>
    </div>

    {/* Dropdown Menu */}
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 px-4 py-2 rounded-xl text-white font-medium text-sm transition duration-300 tracking-wide shadow-sm"
      >
        ⚙️ Options
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-20"
        >
          <button
            onClick={handleProfile}
            className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            My Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-neutral-100 transition-colors border-t border-neutral-100"
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
