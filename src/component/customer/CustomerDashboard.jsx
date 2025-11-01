import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { clearToken } from '../../feature/auth/authSlice';
import { useGetAllProductsQuery } from '../../feature/product/productApi';
import ProductGrid from './ProductGrid'; // Assuming ProductGrid is a separate component
import CustomerNavbar from './NavbarCust'; // Your updated CustomerNavbar
import { useGetCurrentUserQuery } from '../../feature/user/userApi';
import { FiFilter } from 'react-icons/fi'; // Filter icon
import { MdSort } from 'react-icons/md'; // Sort icon
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: products = [], isLoading } = useGetAllProductsQuery();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const { totalQuantity } = useSelector((state) => state.cart);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]); // Retaining this line but not using 'y' for parallax

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const heroVariants = { // Simplified entrance animation
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Removed: welcomeTextVariants

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Reusable component for animated section headers
  const AnimatedSectionHeader = ({ title, subtitle }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    return (
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeInUpVariants}
        className="text-center mb-12"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          {title}
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"
        />
        {subtitle && (
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CustomerNavbar />
      </motion.div>
      
      {/* Main Content */}
      <main className="pt-5"> {/* Adjusted padding-top for fixed navbar */}
        {/* Welcome Banner Section (SIMPLIFIED) */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16 md:py-24 overflow-hidden">
          
          {/* Static Background Overlay (Removed complex animations) */}
          <div className="absolute inset-0 bg-black opacity-10" />
          
          {/* Content Container */}
          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              {/* Welcome Title */}
              <motion.h1 
                variants={itemVariants} // Use itemVariants for a subtle spring up
                className="text-4xl md:text-5xl font-bold leading-tight"
              >
                Welcome,{" "}
                <motion.span 
                  variants={itemVariants}
                  transition={{ delay: 0.2 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
                >
                  {userLoading ? "Customer" : user?.name || "Customer"}!
                </motion.span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                variants={itemVariants}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              >
                Discover the perfect accessories for your mobile devices.
              </motion.p>
              
              {/* Swiper Slides (Kept) */}
              <div className="w-full max-w-4xl mx-auto mt-5">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={30}
                  slidesPerView={3}
                  loop={true}
                  autoplay={{ delay: 3000 }}
                  pagination={{ clickable: true }}
                  className="rounded-2xl overflow-hidden"
                >
                  <SwiperSlide>
                    <img
                      src="/magsafe belkin.jpg"
                      alt="MagSafe"
                      className="w-full h-96 object-cover"
                    />
                  </SwiperSlide>
          
                  <SwiperSlide>
                    <img
                      src="/45W PowerBank.jpg"
                      alt="Power Bank"
                      className="w-full h-96 object-cover"
                    />
                  </SwiperSlide>
          
                  <SwiperSlide>
                    <img
                      src="/adaptor.jpg"
                      alt="Adaptor"
                      className="w-full h-96 object-cover"
                    />
                  </SwiperSlide>
          
                  <SwiperSlide>
                    <img
                      src="/Airpods max.jpg"
                      alt="Airpods"
                      className="w-full h-96 object-cover"
                    />
                  </SwiperSlide>
          
                  <SwiperSlide>
                    <img
                      src="/apple earphones.jpg"
                      alt="Airpods"
                      className="w-full h-96 object-cover"
                    />
                  </SwiperSlide>
                  
                </Swiper>
              </div>
          
              {/* Quick Stats Animation (Used simple stagger) */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 flex flex-wrap gap-6 justify-center items-center"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-yellow-400">
                    {products.length}+
                  </div>
                  <p className="text-blue-100 text-sm">Accessories Available</p>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-green-400">
                    {totalQuantity}
                  </div>
                  <p className="text-blue-100 text-sm">Items in Cart</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-red-400">
                    50+
                  </div>
                  <p className="text-blue-100 text-sm">Satisfied Customers</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>          
          
        </section>

        {/* Products Section (Main Product Listing) - REMAINS UNCHANGED */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          {/* ... (Content remains the same) ... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSectionHeader 
              title="Explore Our Mobile Accessories"
              subtitle="Find the perfect companion for your smartphone, tablet, and more!"
            />

            {/* Filter and Sort Bar (Updated for Mobile Accessories) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, threshold: 0.1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-0 w-full sm:w-auto">
                <FiFilter className="text-gray-500 text-xl" />
                <select className="form-select border-gray-300 rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  <option>All Accessories</option>
                  <option>Phone Cases</option>
                  <option>Chargers & Cables</option>
                  <option>Headphones & Earbuds</option>
                  <option>Screen Protectors</option>
                  <option>Power Banks</option>
                  <option>Car Mounts</option>
                  <option>Smartwatches</option>
                  <option>Other Gadgets</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <MdSort className="text-gray-500 text-xl" />
                <select className="form-select border-gray-300 rounded-lg text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  <option>Sort by: Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                  <option>Best Selling</option>
                </select>
              </div>
            </motion.div>

            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-20"
              >
                <div className="text-center">
                  {/* Enhanced Loading Animation */}
                  <motion.div className="relative mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-400 border-b-transparent"
                    />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-gray-700 mb-2"
                  >
                    Loading Accessories
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500"
                  >
                    Please wait while we fetch amazing products for you...
                  </motion.p>

                  {/* Loading dots animation */}
                  <motion.div className="flex justify-center space-x-1 mt-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-2 h-2 bg-blue-600 rounded-full"
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, threshold: 0.1 }}
                transition={{ duration: 0.6 }}
              >
                <ProductGrid products={products} />
              </motion.div>
            )}
          </div>
        </section>

    

      </main>

      {/* Enhanced Footer with Animations - REMAINS UNCHANGED */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white relative overflow-hidden"
      >
        {/* ... (Footer content remains the same) ... */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 0.1, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: 0
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {/* Company Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-2">
                <motion.div 
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg"
                >
                  <span className="text-white font-bold text-lg">PT</span>
                </motion.div>
                <span className="text-2xl font-bold">PriceTag</span>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400"
              >
                Your trusted partner for premium quality mobile accessories.
              </motion.p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {['About Us', 'Contact', 'FAQ', 'Shipping Info'].map((link, index) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.a 
                      href="#" 
                      whileHover={{ 
                        x: 8, 
                        color: '#ffffff',
                        scale: 1.05
                      }}
                      transition={{ duration: 0.2 }}
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Customer Service */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                {['Help Center', 'Return Policy', 'Size Guide', 'Track Order'].map((link, index) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.a 
                      href="#" 
                      whileHover={{ 
                        x: 8, 
                        color: '#ffffff',
                        scale: 1.05
                      }}
                      transition={{ duration: 0.2 }}
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 mb-4"
              >
                Subscribe for exclusive offers and updates
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex"
              >
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#3B82F6' }}
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none transition-all"
                />
                <motion.button 
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.hr 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="my-8 border-gray-800" 
          />
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-sm"
            >
              © 2025 MyShop. All rights reserved.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex space-x-6 mt-4 md:mt-0"
            >
              {['Privacy Policy', 'Terms of Service'].map((link, index) => (
                <motion.a 
                  key={link}
                  href="#" 
                  whileHover={{ 
                    y: -3, 
                    color: '#ffffff',
                    scale: 1.05
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default CustomerDashboard;