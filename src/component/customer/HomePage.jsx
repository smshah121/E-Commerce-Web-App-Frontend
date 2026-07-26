import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useGetAllProductsQuery } from "../../feature/product/productApi";
import Navbar from "./Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  Star,
  ArrowRight,
  Tag,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products = [], isLoading } = useGetAllProductsQuery();


 
  
  const { token, role } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const handleActionClick = () => {
    navigate("/login");
  };

  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
      const offsetTop = section.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation System Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };


   const uniqueStores = [
 ...new Map(
    filteredProducts
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

  const AnimatedSectionHeader = ({ title, subtitle }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
          {title}
        </h2>
        <div className="w-20 h-1.5 bg-gray-600 mx-auto rounded-full mb-4" />
        {subtitle && <p className="text-gray-500 text-lg max-w-xl mx-auto">{subtitle}</p>}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-blue-500 selection:text-white antialiased">
      <Navbar
        
        onScrollToSection={handleScrollToSection}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Modern Split Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-black text-white overflow-hidden pt-20">
  {/* Background */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Top-right blue glow */}
    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[140px]" />

    {/* Bottom-left purple glow */}
    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[140px]" />

    {/* Center white glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-white/[0.03] blur-[100px]" />

    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />

    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_85%)]" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="lg:col-span-6 text-center lg:text-left"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full
          bg-white/[0.04] border border-white/10
          text-sm text-gray-300 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
          The Tech Accessories Marketplace
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[0.95]">
          Discover Your Next
          <br />

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
            Unbeatable Deal.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 text-base sm:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Welcome to{" "}
          <span className="text-white font-semibold">
            PriceTag
          </span>
          . Discover quality tech accessories from trusted sellers,
          all in one marketplace. Shop your favorites, explore new
          products, and find your next great deal.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">

          {/* Primary */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleScrollToSection("featured-products")}
            className="
              px-8 py-4
              bg-white text-black
              rounded-xl
              font-semibold
              shadow-[0_0_30px_rgba(255,255,255,0.12)]
              hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]
              hover:bg-gray-100
              transition-all duration-300
            "
          >
            Explore Products
          </motion.button>

          {/* Secondary */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleActionClick}
            className="
              px-8 py-4
              bg-white/[0.05]
              text-white
              rounded-xl
              font-semibold
              border border-white/10
              backdrop-blur-md
              hover:bg-white/[0.1]
              hover:border-white/20
              transition-all duration-300
            "
          >
            Sign In Account
          </motion.button>

        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-white">✓</span>
            Trusted Sellers
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">✓</span>
            Secure Payments
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">✓</span>
            Quality Products
          </div>
        </div>
      </motion.div>

      {/* Right Product Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:col-span-6 w-full max-w-xl mx-auto"
      >
        <div className="relative">

          {/* Glow behind carousel */}
          <div className="
            absolute
            -inset-6
            bg-gradient-to-r
            from-blue-600/20
            via-purple-600/10
            to-white/5
            blur-[60px]
            rounded-full
          " />

          {/* Carousel container */}
          <div className="
            relative
            p-2
            rounded-3xl
            bg-white/[0.04]
            border border-white/10
            backdrop-blur-xl
            shadow-[0_0_80px_rgba(255,255,255,0.06)]
          ">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="
                rounded-2xl
                overflow-hidden
                aspect-square
                sm:aspect-[4/3]
                lg:aspect-square
                bg-zinc-950
              "
            >
              {[
                "/magsafe belkin.jpg",
                "/45W PowerBank.jpg",
                "/adaptor.jpg",
                "/Airpods max.jpg",
                "/apple earphones.jpg",
              ].map((src, index) => (
                <SwiperSlide key={index} className="relative">
                  <img
                    src={src}
                    alt="Featured Premium Tech Accessory"
                    className="
                      w-full h-full
                      object-cover
                      opacity-90
                      transition-transform
                      duration-700
                      hover:scale-105
                    "
                  />

                  {/* Image overlay */}
                  <div className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/10
                    to-transparent
                  " />

                  {/* Slide label */}
                  <div className="absolute bottom-6 left-6">
                    <span className="
                      px-3 py-1.5
                      rounded-full
                      bg-black/50
                      border border-white/10
                      backdrop-blur-md
                      text-xs
                      text-gray-300
                    ">
                      Premium Tech
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </motion.div>

    </div>
  </div>
</section>

      {/* Dynamic Native Grid Showcase */}
      <section id="featured-products" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          title="Featured Collection"
          subtitle="Explore premium accessories designed for your everyday tech."
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Querying catalog inventory...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto"
              >
                <span className="text-4xl block mb-3">🔍</span>
                <h3 className="text-xl font-bold text-gray-900">No Match Found</h3>
                <p className="text-gray-500 mt-1 px-4">We couldn't track items matching "{searchTerm}". Try checking your spelling context.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
              >
                {filteredProducts.map((product) => {
                  console.log('PRODUCT:', product);
  console.log('SELLER:', product.seller);
  console.log(
    'SELLER APPLICATION:',
    product.seller?.sellerApplication
  );
                  const image = product.images?.[0]?.image || null;

                  return (
                  <motion.div
  key={product.id}
  variants={cardVariants}
  onClick={handleActionClick}
  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
>
  {/* Product Image */}
  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
    {image ? (
      <img
        src={image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGx9bm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0YzRjRGNiIvPjwvc3ZnPg==";
        }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          No Image Available
        </span>
      </div>
    )}

    {/* Image Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Hover Action */}
    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
      <div className="w-full py-3 bg-white/95 backdrop-blur-sm text-slate-900 rounded-xl text-sm font-bold text-center shadow-lg">
        {isLoggedIn ? "View Specifications" : "Login to Checkout ↗"}
      </div>
    </div>
  </div>

  {/* Product Information */}
  <div className="p-5 flex flex-col flex-1">

    {/* Store Name */}
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      {product.seller?.sellerApplication?.storeName || "PriceTag"}
    </p>

    {/* Product Name */}
   <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-600 transition-colors duration-200">
      {product.name}
    </h3>

    {/* Description */}
    {product.description && (
      <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
        {product.description}
      </p>
    )}

    {/* Bottom Product Details */}
    <div className="mt-auto pt-5 flex items-center justify-between gap-3">

      {/* Price */}
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">
          Price
        </p>
        <span className="text-xl font-black text-slate-900">
          ${formatPrice(product.price)}
        </span>
      </div>

      {/* Buy Button */}
      <span className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold group-hover:bg-black transition-colors duration-300">
  Buy Now
</span>
    </div>
  </div>
</motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </section>


      {/* Explore Stores */}
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
        Explore Trusted Stores
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

      <span className="text-sm font-semibold text-gray-900">
        Visit Store →
      </span>
    </div>
  </motion.div>
))}
    </motion.div>

  </div>
</section>

      {/* Rest of components (Features / Footer) unchanged but clean */}
     <section id="why-choose-myshop" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto mb-14 max-w-2xl text-center"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
        Why PriceTag?
      </p>

      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Everything you need for a better shopping experience
      </h2>

      <p className="mt-4 text-gray-500">
        We make online shopping simple, secure, and reliable with quality
        products and customer-focused service.
      </p>
    </motion.div>

    {/* Feature Cards */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      {[
        {
          icon: Truck,
          title: "Fast & Free Shipping",
          description:
            "Enjoy reliable delivery and free shipping on qualifying orders, so your purchases reach you quickly.",
        },
        {
          icon: ShieldCheck,
          title: "Secure Shopping",
          description:
            "Your personal and payment information is protected with a secure and trusted checkout experience.",
        },
        {
          icon: Star,
          title: "Quality Products",
          description:
            "Discover carefully selected products that meet our standards for quality, value, and reliability.",
        },
      ].map((feature) => {
        const Icon = feature.icon;

        return (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            whileHover={{
              y: -6,
              transition: { duration: 0.2 },
            }}
          >
            <div className="group h-full rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:border-gray-300 hover:shadow-xl">

              {/* Icon */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-900 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-gray-500">
                {feature.description}
              </p>

              {/* Learn More */}
              <div className="mt-6 flex items-center text-sm font-medium text-gray-700 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </div>
</section>

      {/* Footer Ecosystem */}
      {/* Footer Ecosystem */}
<footer
  id="contact-us"
  className="border-t border-white/10 bg-black text-white"
>
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

    {/* Main Footer */}
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

      {/* Brand */}
      <div className="space-y-4">

        <Link
          to="/"
          className="inline-flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            <Tag className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold text-white">
            PriceTag
          </span>
        </Link>

        <p className="max-w-xs text-sm leading-relaxed text-gray-400">
          Your trusted destination for premium quality products
          at unbeatable prices.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-2 pt-2">

          <a
            href="#"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            <Facebook className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            <Twitter className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            <Instagram className="h-4 w-4" />
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            <Linkedin className="h-4 w-4" />
          </a>

        </div>
      </div>


      {/* Quick Links */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">
          Quick Links
        </h3>

        <ul className="space-y-3 text-sm">
          <li>
            <Link
              to="/"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Home
            </Link>
          </li>

          <li>
            <a
              href="#featured-products"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Products
            </a>
          </li>

          <li>
            <a
              href="#about"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              About Us
            </a>
          </li>

          <li>
            <a
              href="#contact-us"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>


      {/* Customer Service */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">
          Customer Service
        </h3>

        <ul className="space-y-3 text-sm">
          <li>
            <a
              href="#"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Help Center
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Return Policy
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Shipping Information
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Track Order
            </a>
          </li>
        </ul>
      </div>


      {/* Account */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">
          Your Account
        </h3>

        <ul className="space-y-3 text-sm">
          <li>
            <Link
              to="/login"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Sign In
            </Link>
          </li>

          <li>
            <Link
              to="/signup"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Create Account
            </Link>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Shopping Cart
            </a>
          </li>

          <li>
            <a
              href="#"
              className="text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Order History
            </a>
          </li>
        </ul>
      </div>

    </div>


    {/* Divider */}
    <div className="my-8 h-px w-full bg-white/10" />


    {/* Bottom Footer */}
    <div className="flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

      <p>
        © {new Date().getFullYear()} PriceTag. All rights reserved.
      </p>

      <div className="flex gap-6">
        <a
          href="#"
          className="transition-colors duration-200 hover:text-white"
        >
          Privacy Policy
        </a>

        <a
          href="#"
          className="transition-colors duration-200 hover:text-white"
        >
          Terms of Service
        </a>
      </div>

    </div>

  </div>
</footer>
    </div>
  );
};

export default HomePage;