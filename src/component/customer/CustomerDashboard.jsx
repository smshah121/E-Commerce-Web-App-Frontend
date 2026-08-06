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

  


   const uniqueStores = [
 ...new Map(
    products
      .filter(
        (product) =>
          product.seller?.sellerApplication?.storeName
      )
      .map((product) => [
        product.seller.id,
        {
          id: product.seller.id,
          storeName: product.seller.sellerApplication.storeName,
          storeDescription:
            product.seller.sellerApplication.storeDescription,
        },
      ])
  ).values(),
];

  // Modern tech-focused animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
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
          className="w-20 h-1 bg-gray-700 mx-auto rounded-full mb-4"
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
      <div>
        <CustomerNavbar />
      </div>
      
      {/* Main Content */}
      <main className="pt-2"> 
        {/* Welcome Cyber Banner Section */}
       <section className="relative bg-black text-white py-16 md:py-24 overflow-hidden border-b border-gray-900">
  {/* Premium Background Effects */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.025]" />

  {/* Subtle Glowing Effects */}
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 z-10">

    {/* Welcome Header */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      <motion.p
        variants={itemVariants}
        className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-gray-500"
      >
        PriceTag Marketplace
      </motion.p>

      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-6xl font-black tracking-tight leading-none"
      >
        Welcome,{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 font-extrabold">
          {userLoading ? "Explorer" : user?.name || "Explorer"}
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide"
      >
        Explore Premium Tech Accessories
      </motion.p>
    </motion.div>

    {/* Swiper Carousel */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="w-full max-w-5xl mx-auto mt-4"
    >
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
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="pb-12"
      >
        {[
          "/magsafe belkin.jpg",
          "/45W PowerBank.jpg",
          "/adaptor.jpg",
          "/Airpods max.jpg",
          "/apple earphones.jpg",
        ].map((src, i) => (
          <SwiperSlide
            key={i}
            className="transition-transform duration-300"
          >
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-950">

              {/* Image */}
              <img
                src={src}
                alt="Premium Tech Accessory"
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dark Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70" />

              {/* Hover Glow */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-500" />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>

    {/* Tech Statistics */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-4 flex items-center justify-center gap-4 max-w-4xl mx-auto"
    >
      {[
        {
          label: "Premium Devices Available",
          val: `${products.length}+`,
          icon: <FiTrendingUp className="text-gray-300 text-xl" />,
        },
        {
          label: "Active Items in Cart",
          val: totalQuantity,
          icon: <FiShoppingBag className="text-gray-300 text-xl" />,
        },
      ].map((stat, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="flex items-center space-x-4 bg-white/[0.04] p-4 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
        >
          {/* Icon */}
          <div className="p-3 rounded-lg bg-white/[0.06] border border-white/10">
            {stat.icon}
          </div>

          {/* Content */}
          <div className="text-left">
            <div className="text-2xl font-black text-white tracking-tight">
              {stat.val}
            </div>

            <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">
              {stat.label}
            </p>
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

      <section
        id="explore-stores"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
          {/* Header */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Marketplace Stores
            </p>
      
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Recommended Stores
            </h2>
      
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Discover products from trusted sellers and explore their collections
              in one place.
            </p>
          </div>
          
      
          {/* Store Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {uniqueStores.map((store) => (
        <motion.div
          key={store.storeName}
          variants={cardVariants}
          whileHover={{ y: -6 }}
          className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
            <span className="text-xl font-bold">
              {store.storeName?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
      
          <h3 className="text-xl font-bold tracking-tight text-gray-950">
            {store.storeName || "PriceTag"}
          </h3>
      
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {store.storeDescription ||
              "Explore quality products from this trusted seller."}
          </p>
      
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Trusted Seller
            </span>
      
            <button 
            onClick={() => navigate(`/store/${store.id}`)}
            className="text-sm font-semibold text-gray-900">
              Visit Store →
            </button>
          </div>
        </motion.div>
      ))}
          </motion.div>
      
        </div>
      </section>

      {/* Futuristic Deep Space Footer */}
     <motion.footer
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  className="bg-black text-gray-400 relative border-t border-white/10"
>
  {/* Particle Overlay */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -80, 0],
          opacity: [0, 0.12, 0],
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          bottom: 0,
        }}
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
      <motion.div
        variants={itemVariants}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.08)]">
  <svg
    className="w-6 h-6 text-black"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5 4 4.67 4.67 4 5.5 4S7 4.67 7 5.5 6.33 7 5.5 7z" />
  </svg>
</div>

          {/* Brand Name */}
          <span className="text-xl font-extrabold text-white tracking-tight">
            PriceTag
          </span>
        </div>

        <p className="text-sm leading-relaxed text-gray-500">
          Your progressive hub for ultra-premium mobile hardware architectures.
        </p>
      </motion.div>

      {/* Link Groups */}
      {[
        {
          title: "Systems",
          links: [
            "About Us",
            "Contact",
            "FAQ",
            "Shipping Info",
          ],
        },
        {
          title: "Service Hub",
          links: [
            "Help Center",
            "Return Policy",
            "Size Guide",
            "Track Order",
          ],
        },
      ].map((group, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
        >
          <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
            {group.title}
          </h3>

          <ul className="space-y-2.5 text-sm font-medium">
            {group.links.map((link) => (
              <li key={link}>
                <motion.a
                  href="#"
                  whileHover={{ x: 4 }}
                  className="text-gray-500 hover:text-white transition-colors block"
                >
                  {link}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      {/* Newsletter Container */}
      <motion.div
        variants={itemVariants}
        className="space-y-4"
      >
        <h3 className="text-sm font-bold text-white tracking-wider uppercase">
          System Updates
        </h3>

        <p className="text-sm text-gray-500">
          Subscribe to ingest early access drop modules.
        </p>

        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 focus-within:border-white/30 transition-all">
          <input
            type="email"
            placeholder="Enter dynamic mail"
            className="w-full bg-transparent px-3 text-sm text-white focus:outline-none placeholder:text-gray-600"
          />

          <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-200 shadow-md transition-colors">
            Join
          </button>
        </div>
      </motion.div>
    </motion.div>

    {/* Divider */}
    <hr className="my-10 border-white/10" />

    {/* Bottom Footer */}
    <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 font-medium gap-4">
      <p>
        © 2026 PriceTag Corp. All rights reserved.
      </p>

      <div className="flex space-x-6">
        <a
          href="#"
          className="hover:text-white transition-colors"
        >
          Privacy Protocols
        </a>

        <a
          href="#"
          className="hover:text-white transition-colors"
        >
          Terms of Operations
        </a>
      </div>
    </div>
  </div>
</motion.footer>
    </div>
  );
};

export default CustomerDashboard;