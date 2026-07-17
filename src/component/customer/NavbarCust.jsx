import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // added useLocation
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { FaBoxOpen, FaStore } from "react-icons/fa"; 
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
  const location = useLocation(); // URL path detect karne ke liye
  
  const { totalQuantity } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  // Agar user dashboard par NAHI hai, toh navbar direct white rahega
  const isDarkPage = location.pathname === '/customer-dashboard' || location.pathname === '/';
  const shouldBeWhite = isScrolled || !isDarkPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${
      shouldBeWhite 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-[#0b0f19] border-slate-900 shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Premium Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="relative w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.25)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] transition-all duration-500 transform group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className={`text-xl font-black tracking-tight transition-colors duration-500 ${
                  shouldBeWhite ? 'text-slate-900' : 'text-white'
                }`}>
                  PriceTag
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                  Hardware Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className={`ml-10 flex items-center space-x-1 transition-colors duration-500 ${
              shouldBeWhite ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                    shouldBeWhite 
                      ? 'hover:text-blue-600 hover:bg-slate-100' 
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {isLoggedIn && (
                <Link
                  to="/become-seller"
                  className={`ml-3 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300 ${
                    shouldBeWhite
                      ? 'text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white hover:border-transparent shadow-sm'
                      : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/50'
                  }`}
                >
                  Become a Seller
                </Link>
              )}
            </div>
          </div>

          {/* User Controls and Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className={`p-2.5 rounded-xl transition-all duration-200 ${
              shouldBeWhite 
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}>
              <FiSearch className="w-5 h-5" />
            </button>

            <button
              onClick={handleCartClick}
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                shouldBeWhite 
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <AiOutlineShoppingCart className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className={`absolute top-1 right-1 text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-black shadow-lg transition-colors duration-500 ${
                  shouldBeWhite 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-emerald-500 text-slate-950'
                }`}>
                  {totalQuantity}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 p-1.5 pr-3 rounded-xl border transition-all duration-200 ${
                    shouldBeWhite
                      ? 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                      : 'bg-slate-900 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <HiOutlineMenuAlt3 className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold transition-colors duration-500 ${
                    shouldBeWhite ? 'text-slate-700' : 'text-slate-300'
                  }`}>Menu</span>
                </button>

                {/* Dropdown Menu Container */}
                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 mt-3 w-72 shadow-2xl rounded-2xl z-20 overflow-hidden border ${
                          shouldBeWhite
                            ? 'bg-white border-slate-200/80'
                            : 'bg-[#0f1422] border-slate-800 backdrop-blur-xl'
                        }`}
                      >
                        <div className="py-1">
                          <div className={`px-5 py-3.5 border-b ${
                            shouldBeWhite ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/60 border-slate-800/60'
                          }`}>
                            <p className={`text-sm font-bold tracking-wide ${shouldBeWhite ? 'text-slate-900' : 'text-white'}`}>Account Control</p>
                            <p className="text-xs text-slate-500">Manage node configurations</p>
                          </div>
                          
                          {[
                            { name: 'Dashboard', icon: <CgProfile className="w-4 h-4 mr-3 text-blue-500" />, path: '/customer-dashboard' },
                            { name: 'Become a Seller', icon: <FaStore className="w-4 h-4 mr-3 text-cyan-500" />, path: '/become-seller' },
                            { name: 'My Cart', icon: <AiOutlineShoppingCart className="w-4 h-4 mr-3 text-emerald-500" />, path: '/my-cart' },
                            { name: 'My Orders', icon: <FaBoxOpen className="w-4 h-4 mr-3 text-purple-500" />, path: '/my-orders' },
                            { name: 'My Profile', icon: <CgProfile className="w-4 h-4 mr-3 text-indigo-500" />, path: '/my-profile' },
                          ].map((item) => (
                            <button 
                              key={item.name}
                              onClick={() => { navigate(item.path); setShowDropdown(false); }} 
                              className={`flex items-center w-full px-5 py-3 text-xs font-bold transition-all duration-150 ${
                                shouldBeWhite 
                                  ? 'text-slate-700 hover:bg-slate-50 hover:text-blue-600' 
                                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {item.icon}
                              <div className="flex-1 text-left">{item.name}</div>
                            </button>
                          ))}

                          <hr className={shouldBeWhite ? 'my-1 border-slate-100' : 'my-1 border-slate-800'} />
                          
                          <button 
                            onClick={handleLogout} 
                            className={`flex items-center w-full px-5 py-3 text-xs font-bold transition-all duration-150 ${
                              shouldBeWhite 
                                ? 'text-slate-500 hover:bg-red-50 hover:text-red-600' 
                                : 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                            }`}
                          >
                            <TbLogout className="w-4 h-4 mr-3 text-red-500" />
                            <div className="flex-1 text-left">Secure Logout</div>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={handleLoginClick} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  shouldBeWhite ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                  Sign In
                </button>
                <button onClick={handleSignupClick} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 transition-all duration-200">
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Expand Trigger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all ${
                  shouldBeWhite 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isMobileMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenuAlt3 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Responsive Mobile Menu System */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-screen border-t' : 'max-h-0 border-t-0'
      } ${
        shouldBeWhite 
          ? 'bg-white/95 backdrop-blur-xl border-slate-200' 
          : 'bg-[#0b0f19]/95 backdrop-blur-xl border-slate-800'
      }`}>
        <div className="px-4 pt-4 pb-8 space-y-2">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search accessories ecosystem..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-500/50 ${
                shouldBeWhite 
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' 
                  : 'bg-slate-900 border-white/5 text-white placeholder:text-slate-600'
              }`}
            />
            <FiSearch className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              shouldBeWhite ? 'text-slate-400' : 'text-slate-600'
            }`} />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                shouldBeWhite ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              to="/become-seller"
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                shouldBeWhite ? 'text-indigo-600 hover:bg-indigo-50/50' : 'text-cyan-400 hover:bg-cyan-50/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a Seller
            </Link>
          )}
          
          <button
            onClick={handleCartClick}
            className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              shouldBeWhite ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AiOutlineShoppingCart className="w-4 h-4 mr-3 text-emerald-500" />
            My Cart ({totalQuantity})
          </button>

          {isLoggedIn && (
            <div className={`pt-2 border-t space-y-1 ${shouldBeWhite ? 'border-slate-100' : 'border-slate-900'}`}>
              <button
                onClick={() => { navigate('/my-profile'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  shouldBeWhite ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <CgProfile className="w-4 h-4 mr-3 text-indigo-500" />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  shouldBeWhite ? 'text-red-500 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/5'
                }`}
              >
                <TbLogout className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <div className={`pt-4 border-t flex flex-col gap-2 ${shouldBeWhite ? 'border-slate-100' : 'border-slate-900'}`}>
              <button
                onClick={handleLoginClick}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  shouldBeWhite ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={handleSignupClick}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/10 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;