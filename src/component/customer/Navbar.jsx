/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Removed: import { useGetAllProductsQuery } from '../../feature/product/productApi';
import { motion} from "framer-motion";
import SearchBar from './SearchBar';


// 1. Accept searchTerm and setSearchTerm as props
const Navbar = ({ isLoggedIn, role, onScrollToSection, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Removed: const { data: products = [], isLoading } = useGetAllProductsQuery();
  // Removed: const [searchTerm, setSearchTerm] = useState("");
  
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
    <nav
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
    isScrolled
      ? "bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      : "bg-transparent"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 md:h-20 gap-6">

      {/* ================= LOGO ================= */}
      <div className="flex-shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          {/* Logo Icon */}
          <div className="relative">
            <div
              className="
                relative
                w-10 h-10 md:w-11 md:h-11
                rounded-xl
                bg-white
                flex items-center justify-center
                shadow-[0_0_25px_rgba(255,255,255,0.12)]
                transition-all duration-300
                group-hover:scale-105
              "
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>

            {/* Subtle glow */}
            <div
              className="
                absolute
                -inset-2
                rounded-xl
                bg-white/10
                blur-xl
                opacity-0
                group-hover:opacity-100
                transition-opacity duration-500
              "
            />
          </div>

          {/* Brand */}
          <div className="hidden sm:flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              PriceTag
            </span>

            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/40">
              Marketplace
            </span>
          </div>
        </Link>
      </div>


      {/* ================= DESKTOP SEARCH ================= */}
      <motion.div
        variants={heroTextVariants}
        transition={{ delay: 0.2 }}
        className="hidden md:block flex-1 max-w-xl"
      >
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isNavbar
        />
      </motion.div>


      {/* ================= RIGHT ACTIONS ================= */}
      <div className="hidden md:flex items-center gap-2">

        {/* Cart */}
        <button
          onClick={handleCartClick}
          className="
            relative
            p-3
            rounded-xl
            text-white/70
            hover:text-white
            hover:bg-white/5
            transition-all duration-300
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4"
            />
          </svg>

          {/* Cart Badge */}
          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-4
              h-4
              px-1
              flex
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              text-[9px]
              font-bold
            "
          >
            0
          </span>
        </button>


        {/* Sign In */}
        {!isLoggedIn && (
          <>
            <button
              onClick={handleLoginClick}
              className="
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                text-white/70
                hover:text-white
                hover:bg-white/5
                transition-all duration-300
              "
            >
              Sign In
            </button>


            {/* Get Started */}
            <button
              onClick={handleSignupClick}
              className="
                px-5
                py-2.5
                rounded-lg
                bg-white
                text-black
                text-sm
                font-semibold
                shadow-[0_0_25px_rgba(255,255,255,0.08)]
                hover:bg-gray-100
                hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                transition-all duration-300
              "
            >
              Get Started
            </button>
          </>
        )}
      </div>


      {/* ================= MOBILE MENU BUTTON ================= */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="
            p-2.5
            rounded-xl
            text-white
            hover:bg-white/10
            transition-all duration-300
          "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

    </div>
  </div>


  {/* ================= MOBILE MENU ================= */}
  <div
    className={`md:hidden transition-all duration-300 overflow-hidden ${
      isMobileMenuOpen
        ? "max-h-[600px] opacity-100"
        : "max-h-0 opacity-0"
    }`}
  >
    <div className="bg-black/95 backdrop-blur-2xl border-t border-white/10">

      <div className="px-4 py-5 space-y-4">

        {/* Mobile Search */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isNavbar
        />


        {/* Navigation Links */}
        <div className="space-y-1 pt-2">

          {navLinks.map((link) =>
            link.isInternal ? (
              <a
                key={link.name}
                href={`#${link.href}`}
                className="
                  block
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  text-white/70
                  hover:text-white
                  hover:bg-white/5
                  transition-all duration-300
                "
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
                className="
                  block
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  text-white/70
                  hover:text-white
                  hover:bg-white/5
                  transition-all duration-300
                "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          )}

        </div>


        {/* Mobile Cart */}
        <button
          onClick={() => {
            handleCartClick();
            setIsMobileMenuOpen(false);
          }}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-sm
            font-medium
            text-white/70
            hover:text-white
            hover:bg-white/5
            transition-all duration-300
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>

          Cart
          <span className="ml-auto text-xs text-white/40">
            0 items
          </span>
        </button>


        {/* Mobile Auth */}
        {!isLoggedIn && (
          <div className="pt-4 border-t border-white/10 space-y-3">

            <button
              onClick={() => {
                handleLoginClick();
                setIsMobileMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                text-white/80
                border
                border-white/10
                hover:bg-white/5
                transition-all duration-300
              "
            >
              Sign In
            </button>

            <button
              onClick={() => {
                handleSignupClick();
                setIsMobileMenuOpen(false);
              }}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-white
                text-black
                text-sm
                font-semibold
                hover:bg-gray-100
                transition-all duration-300
              "
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