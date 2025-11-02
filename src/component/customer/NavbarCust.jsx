import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FaBoxOpen } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { clearToken } from '../../feature/auth/authSlice';

const CustomerNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalQuantity } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  const handleCartClick = () => {
    navigate("/my-cart");
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleSignupClick = () => {
    navigate("/register");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/customer-dashboard' },
    { name: 'My Orders', href: '/my-orders' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${
      isScrolled ? 'shadow-lg border-b border-gray-100' : 'shadow-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Enhanced Premium Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                {/* Main logo container with premium styling */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  
                  {/* Price tag icon design */}
                  <div className="relative z-10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white transform transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                    </svg>
                  </div>
                  
                  {/* Animated sparkle effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-75 animate-ping"></div>
                </div>
                
                {/* Outer glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse"></div>
              </div>
              
              {/* Premium Typography */}
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-500">
                  PriceTag
                </span>
                <span className="text-xs font-medium text-gray-500 tracking-wider uppercase group-hover:text-purple-500 transition-colors duration-300">
                  Premium Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side buttons - Search, Cart, and Menu */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Search Button */}
            <a href="#search">
              <button className="p-3 rounded-xl transition-all duration-300 hover:scale-110 text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg">
              <FiSearch className="w-5 h-5" />
            </button>
              </a>

            {/* Enhanced Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative p-3 rounded-xl transition-all duration-300 hover:scale-110 group text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg"
            >
              <AiOutlineShoppingCart className="w-6 h-6" />
              {/* Premium Cart badge */}
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Enhanced User Menu Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <HiOutlineMenuAlt3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold">Menu</span>
                </button>

                {/* Enhanced Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 z-20 overflow-hidden">
                      <div className="py-2">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                          <p className="text-lg font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">Account Menu</p>
                          <p className="text-sm text-gray-600">Manage your premium experience</p>
                        </div>
                        <button onClick={() => { navigate('/customer-dashboard'); setShowDropdown(false); }} className="flex items-center w-full px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-all duration-300">
                          <CgProfile className="w-5 h-5 mr-4 text-purple-500" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">Dashboard</div>
                            <div className="text-xs text-gray-500">Overview of your account</div>
                          </div>
                        </button>
                        <button onClick={handleCartClick} className="flex items-center w-full px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-all duration-300">
                          <AiOutlineShoppingCart className="w-5 h-5 mr-4 text-indigo-500" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">My Cart</div>
                            <div className="text-xs text-gray-500">{totalQuantity} premium items</div>
                          </div>
                        </button>
                        <button onClick={() => { navigate('/my-orders'); setShowDropdown(false); }} className="flex items-center w-full px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-all duration-300">
                          <FaBoxOpen className="w-5 h-5 mr-4 text-green-500" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">My Orders</div>
                            <div className="text-xs text-gray-500">Track your purchases</div>
                          </div>
                        </button>
                        <button onClick={() => { navigate('/my-profile'); setShowDropdown(false); }} className="flex items-center w-full px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-sm text-gray-700 hover:text-indigo-600 transition-all duration-300">
                          <CgProfile className="w-5 h-5 mr-4 text-purple-500" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">My Profile</div>
                            <div className="text-xs text-gray-500">Account settings</div>
                          </div>
                        </button>
                        <hr className="my-2 border-gray-200" />
                        <button onClick={handleLogout} className="flex items-center w-full px-6 py-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-sm text-gray-700 hover:text-red-600 transition-all duration-300">
                          <TbLogout className="w-5 h-5 mr-4 text-red-500" />
                          <div className="flex-1 text-left">
                            <div className="font-semibold">Logout</div>
                            <div className="text-xs text-gray-500">Sign out securely</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={handleLoginClick} className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 text-indigo-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                  Sign In
                </button>
                <button onClick={handleSignupClick} className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-xl transition-all duration-300 text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className="w-6 h-6" />
              ) : (
                <HiOutlineMenuAlt3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Content */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-1">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search premium products..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  link.current
                    ? 'text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={handleCartClick}
              className="w-full flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
            >
              <AiOutlineShoppingCart className="w-5 h-5 mr-3" />
              My Cart ({totalQuantity})
            </button>

            {isLoggedIn && (
              <>
                <button
                  onClick={() => { navigate('/my-profile'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                >
                  <CgProfile className="w-5 h-5 mr-3" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
                >
                  <TbLogout className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={handleLoginClick}
                  className="w-full px-4 py-3 text-indigo-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl text-base font-semibold transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignupClick}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white rounded-xl text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;