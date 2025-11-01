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
  const y = useTransform(scrollY, [0, 500], [0, 100]); // For parallax effect on banner

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

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const welcomeTextVariants = {
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
      <main className="pt-20"> {/* Adjusted padding-top for fixed navbar */}
        {/* Welcome Banner Section */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16 md:py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <motion.div 
            style={{ y }} // Parallax effect
            className="absolute inset-0 bg-black opacity-10"
          />
          <motion.div 
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px"
            }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.sin(i) * 20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
              />
            ))}
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 25, 0],
              x: [0, 15, 0],
              rotate: [0, -15, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute bottom-10 left-10 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg"
          />
          <div className='flex flex-col justify-center items-center'>
            <motion.h1 
                variants={welcomeTextVariants}
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              >
                Welcome,{" "}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ 
                    delay: 0.5, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
                >
                  {userLoading ? "Customer" : user?.name || "Customer"}!
                </motion.span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              >
                Discover the perfect accessories for your mobile devices.
              </motion.p>
            <div className="w-4xl">
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
                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              
              
              

              {/* Quick Stats Animation */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-yellow-400"
                  >
                    {products.length}+
                  </motion.div>
                  <p className="text-blue-100 text-sm">Accessories Available</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-green-400"
                  >
                    {totalQuantity}
                  </motion.div>
                  <p className="text-blue-100 text-sm">Items in Cart</p>
                </motion.div>

                 <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-red-400"
                  >
                    50+
                  </motion.div>
                  <p className="text-blue-100 text-sm">Satisfied Customers</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
            </div>          
          
        </section>

        {/* Products Section (Main Product Listing) */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
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

      {/* Enhanced Footer with Animations */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white relative overflow-hidden"
      >
        {/* Animated background elements */}
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
