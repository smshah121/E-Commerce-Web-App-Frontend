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
   <nav
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
    isScrolled
      ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      : "bg-black/30 backdrop-blur-md border-b border-white/10"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">

      {/* Logo */}
      <div className="flex-shrink-0">
        <Link
          to="/"
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isScrolled
                  ? "bg-black shadow-lg"
                  : "bg-white/10 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]"
              }`}
            >
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  isScrolled ? "text-white" : "text-white"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
              </svg>
            </div>

            {/* Subtle glow */}
            {!isScrolled && (
              <div className="absolute inset-0 rounded-xl bg-white/10 blur-xl -z-10" />
            )}
          </div>

          <div className="flex flex-col">
            <span
              className={`text-xl font-black tracking-tight transition-colors duration-300 ${
                isScrolled ? "text-gray-950" : "text-white"
              }`}
            >
              PriceTag
            </span>

            <span
              className={`text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                isScrolled ? "text-gray-400" : "text-white/50"
              }`}
            >
              Premium Shopping
            </span>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="flex items-center space-x-1">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? "text-gray-600 hover:text-black hover:bg-gray-100"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn && (
            <Link
              to="/become-seller"
              className={`ml-3 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                isScrolled
                  ? "text-black border-gray-300 hover:bg-black hover:text-white hover:border-black"
                  : "text-white border-white/20 bg-white/5 hover:bg-white hover:text-black"
              }`}
            >
              Become a Seller
            </Link>
          )}

        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-2">

        {/* Search */}
        <button
          className={`p-2.5 rounded-lg transition-all duration-300 ${
            isScrolled
              ? "text-gray-600 hover:text-black hover:bg-gray-100"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <FiSearch className="w-5 h-5" />
        </button>

        {/* Cart */}
        <button
          onClick={handleCartClick}
          className={`relative p-2.5 rounded-lg transition-all duration-300 ${
            isScrolled
              ? "text-gray-600 hover:text-black hover:bg-gray-100"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <AiOutlineShoppingCart className="w-5 h-5" />

          {totalQuantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold">
              {totalQuantity}
            </span>
          )}
        </button>

        {/* Logged In Menu */}
        {isLoggedIn ? (
          <div className="relative">

            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-lg border transition-all duration-300 ${
                isScrolled
                  ? "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isScrolled
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                <HiOutlineMenuAlt3 className="w-4 h-4" />
              </div>

              <span
                className={`text-xs font-semibold ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                Menu
              </span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
                    className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 shadow-2xl rounded-2xl z-20 overflow-hidden"
                  >

                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-950">
                        Account
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Manage your PriceTag account
                      </p>
                    </div>

                    {[
                      {
                        name: "Dashboard",
                        icon: <CgProfile className="w-4 h-4" />,
                        path: "/customer-dashboard",
                      },
                      {
                        name: "Become a Seller",
                        icon: <FaStore className="w-4 h-4" />,
                        path: "/become-seller",
                      },
                      {
                        name: "My Cart",
                        icon: <AiOutlineShoppingCart className="w-4 h-4" />,
                        path: "/my-cart",
                      },
                      {
                        name: "My Orders",
                        icon: <FaBoxOpen className="w-4 h-4" />,
                        path: "/my-orders",
                      },
                      {
                        name: "My Profile",
                        icon: <CgProfile className="w-4 h-4" />,
                        path: "/my-profile",
                      },
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.path);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                      >
                        <span className="mr-3 text-gray-400">
                          {item.icon}
                        </span>

                        {item.name}
                      </button>
                    ))}

                    <div className="border-t border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <TbLogout className="w-4 h-4 mr-3" />
                      Logout
                    </button>

                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* Guest Buttons */
          <div className="hidden sm:flex items-center gap-2">

            <button
              onClick={handleLoginClick}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-black hover:bg-gray-100"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={handleSignupClick}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              Get Started
            </button>

          </div>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden">

          <button
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
            className={`p-2.5 rounded-lg transition-all ${
              isScrolled
                ? "text-gray-600 hover:bg-gray-100"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {isMobileMenuOpen ? (
              <HiOutlineX className="w-5 h-5" />
            ) : (
              <HiOutlineMenuAlt3 className="w-5 h-5" />
            )}
          </button>

        </div>

      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  <div
    className={`md:hidden overflow-hidden transition-all duration-300 ${
      isMobileMenuOpen
        ? "max-h-screen"
        : "max-h-0"
    } ${
      isScrolled
        ? "bg-white border-t border-gray-100"
        : "bg-black/95 backdrop-blur-xl border-t border-white/10"
    }`}
  >
    <div className="px-4 py-5 space-y-2">

      {/* Mobile Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all ${
            isScrolled
              ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
              : "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
          }`}
        />

        <FiSearch
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isScrolled
              ? "text-gray-400"
              : "text-white/40"
          }`}
        />
      </div>

      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
          className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isScrolled
              ? "text-gray-600 hover:text-black hover:bg-gray-50"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          {link.name}
        </Link>
      ))}

      {isLoggedIn && (
        <Link
          to="/become-seller"
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
          className={`block px-4 py-3 rounded-xl text-sm font-semibold ${
            isScrolled
              ? "text-black hover:bg-gray-50"
              : "text-white hover:bg-white/10"
          }`}
        >
          Become a Seller
        </Link>
      )}

      <button
        onClick={handleCartClick}
        className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
          isScrolled
            ? "text-gray-600 hover:text-black hover:bg-gray-50"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        <AiOutlineShoppingCart className="w-5 h-5 mr-3" />
        My Cart ({totalQuantity})
      </button>

      {!isLoggedIn && (
        <div className="pt-4 border-t border-gray-200/10 space-y-2">

          <button
            onClick={handleLoginClick}
            className={`w-full py-3 rounded-xl text-sm font-semibold ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-50"
                : "text-white hover:bg-white/10"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={handleSignupClick}
            className={`w-full py-3 rounded-xl text-sm font-bold ${
              isScrolled
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
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