import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { clearToken } from '../../feature/auth/authSlice';
import { useGetAllProductsQuery } from '../../feature/product/productApi';
import ProductGrid from './ProductGrid'; 
import CustomerNavbar from './NavbarCust'; 
import { useGetCurrentUserQuery } from '../../feature/user/userApi';
import { FiFilter, FiTrendingUp, FiShoppingBag, FiUsers } from 'react-icons/fi'; 
import { MdSort } from 'react-icons/md'; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: products = [], isLoading } = useGetAllProductsQuery();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();
  const { totalQuantity } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  // Modern tech-focused animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  const AnimatedSectionHeader = ({ title, subtitle }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    return (
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="text-center mb-16 relative"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-slate-800 to-gray-900 mb-4"
        >
          {title}
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="w-20 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mx-auto rounded-full mb-4"
        />
        {subtitle && (
          <motion.p 
            variants={itemVariants}
            className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100"
      >
        <CustomerNavbar />
      </motion.div>
      
      {/* Main Content */}
      <main className="pt-2"> 
        {/* Welcome Cyber Banner Section */}
        <section className="relative bg-[#0b0f19] text-white py-16 md:py-24 overflow-hidden border-b border-slate-800">
          {/* Futuristic Background Grid Patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
          
          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 z-10'>
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-4">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                Welcome,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 font-extrabold drop-shadow-[0_2px_10px_rgba(147,51,234,0.15)]">
                  {userLoading ? "Explorer" : user?.name || "Explorer"}
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
                Explore Premium Tech Accessories
              </motion.p>
            </motion.div>
              
            {/* Swiper Carousel Enhancement */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="w-full max-w-5xl mx-auto mt-4">
              <Swiper
                modules={[Autoplay, Pagination, EffectCoverflow]}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                coverflowEffect={{
                  rotate: 15,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                loop={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="pb-12"
              >
                {["/magsafe belkin.jpg", "/45W PowerBank.jpg", "/adaptor.jpg", "/Airpods max.jpg", "/apple earphones.jpg"].map((src, i) => (
                  <SwiperSlide key={i} className="transition-transform duration-300">
                    <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-md">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
                      <img src={src} alt="Gear Preview" className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          
            {/* Tech Infographics Stats */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-4 flex items-center justify-center  gap-4 max-w-4xl mx-auto">
              {[
                { label: "Premium Devices Available", val: `${products.length}+`, icon: <FiTrendingUp className="text-cyan-400 text-xl" />, border: "hover:border-cyan-500/30" },
                { label: "Active Items in Cart", val: totalQuantity, icon: <FiShoppingBag className="text-emerald-400 text-xl" />, border: "hover:border-emerald-500/30" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className={`flex items-center space-x-4 bg-slate-900/60 p-4 rounded-xl border border-white/5 backdrop-blur-md transition-colors duration-300 ${stat.border}`}
                >
                  <div className="p-3 rounded-lg bg-white/5">{stat.icon}</div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-white tracking-tight">{stat.val}</div>
                    <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>          
        </section>

        {/* Products Grid Marketplace Section */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSectionHeader 
              title="Explore Our Tech Accessories"
              subtitle="Discover quality accessories from trusted sellers."
            />

            {/* Smart Filter & Controls Bar */}
          

            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
                <div className="relative mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 h-14 w-14 rounded-full border-4 border-purple-400 border-b-transparent"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Syncing Components...</h3>
                <p className="text-slate-400 text-sm mt-1">Fetching premium products directly onto your grid.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <ProductGrid products={products} />
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Futuristic Deep Space Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-[#0b0f19] text-slate-400 relative border-t border-slate-800"
      >
        {/* Particle Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -80, 0], opacity: [0, 0.15, 0] }}
              transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
              className="absolute w-1 h-1 bg-blue-500 rounded-full"
              style={{ left: `${Math.random() * 100}%`, bottom: 0 }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-10"
          >
            {/* Branding Elements */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  <span className="text-white font-black text-sm tracking-tighter">PT</span>
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">PriceTag</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                Your progressive hub for ultra-premium mobile hardware architectures.
              </p>
            </motion.div>

            {/* Link Groups */}
            {[{ title: "Systems", links: ['About Us', 'Contact', 'FAQ', 'Shipping Info'] },
              { title: "Service Hub", links: ['Help Center', 'Return Policy', 'Size Guide', 'Track Order'] }
             ].map((group, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase mb-4">{group.title}</h3>
                <ul className="space-y-2.5 text-sm font-medium">
                  {group.links.map((link) => (
                    <li key={link}>
                      <motion.a href="#" whileHover={{ x: 4, color: '#3b82f6' }} className="hover:text-white transition-colors block">
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Newsletter Container */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider uppercase">System Updates</h3>
              <p className="text-sm text-slate-500">Subscribe to ingest early access drop modules.</p>
              <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5 focus-within:border-blue-500/50 transition-all">
                <input
                  type="email"
                  placeholder="Enter dynamic mail"
                  className="w-full bg-transparent px-3 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
                <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-colors">
                  Join
                </button>
              </div>
            </motion.div>
          </motion.div>

          <hr className="my-10 border-slate-900" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 font-medium gap-4">
            <p>© 2026 PriceTag Corp. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Protocols</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Operations</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default CustomerDashboard;