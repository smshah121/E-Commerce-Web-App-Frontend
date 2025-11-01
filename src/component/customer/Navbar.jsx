import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllProductsQuery } from '../../feature/product/productApi';
import { motion} from "framer-motion";

const Navbar = ({ isLoggedIn, role, onScrollToSection }) => { 
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: products = [], isLoading } = useGetAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  
  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCartClick = () => navigate("/login");
  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");

  const navLinks = [
    { name: 'Home', href: '/', isInternal: false },
    { name: 'Products', href: 'featured-products', isInternal: true }, 
    { name: 'Categories', href: 'featured-products', isInternal: true },
    { name: 'About', href: 'why-choose-myshop', isInternal: true },
    { name: 'Contact', href: 'contact-us', isInternal: true },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Enhanced Premium Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
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
              
              {/* Premium Typography with dynamic colors */}
              <div className="flex flex-col">
                <span className={`text-2xl md:text-3xl font-bold transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-500'
                    : 'bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-white group-hover:to-yellow-300'
                }`}>
                  PriceTag
                </span>
                <span className={`text-xs font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-500 group-hover:text-purple-500'
                    : 'text-white/70 group-hover:text-yellow-300'
                }`}>
                  Premium Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <motion.div
                        variants={heroTextVariants}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto mb-8"
                      >
                        <SearchBar
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                        />
                      </motion.div>
          

          {/* Right side Auth + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Enhanced Cart Button */}
            <button 
              onClick={handleCartClick}
              className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 group ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg'
                  : 'text-white/90 hover:text-white hover:bg-white/10 hover:shadow-lg'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {/* Premium Cart badge */}
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                0
              </span>
            </button>

            {!isLoggedIn && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLoginClick}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'text-indigo-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                      : 'text-white hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignupClick}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) =>
              link.isInternal ? (
                <a
                  key={link.name}
                  href={`#${link.href}`}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    onScrollToSection(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}

            {/* Enhanced Mobile Cart */}
            <button
              onClick={() => {
                handleCartClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              Premium Cart (0)
            </button>

            {/* Enhanced Mobile Auth Buttons */}
            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-indigo-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl text-base font-semibold transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    handleSignupClick();
                    setIsMobileMenuOpen(false);
                  }}
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

export default Navbar;