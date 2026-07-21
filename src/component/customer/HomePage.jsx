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
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
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
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 text-white overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Context Branding */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm">
                The Tech Accessories Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
                Discover Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Unbeatable Deal.
                </span>
              </h1>
              <p> className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
                Welcome to <span className="text-white font-semibold">PriceTag</span>. Discover quality tech accessories from trusted sellers, all in one marketplace. Shop your favorites, explore new products, and find your next great deal.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => handleScrollToSection("featured-products")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore Showcase
                </button>
                <button
                  onClick={handleActionClick}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all duration-200"
                >
                  Sign In Account
                </button>
              </div>
            </motion.div>

            {/* Right Column: High-Impact Carousel Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 w-full max-w-md md:max-w-xl mx-auto"
            >
              <div className="relative p-3 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-md shadow-2xl">
                <Swiper
                  modules={[Autoplay, Pagination, EffectFade]}
                  effect={"fade"}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  className="rounded-2xl overflow-hidden aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-950"
                >
                  {["/magsafe belkin.jpg", "/45W PowerBank.jpg", "/adaptor.jpg", "/Airpods max.jpg", "/apple earphones.jpg"].map((src, index) => (
                    <SwiperSlide key={index} className="relative">
                      <img
                        src={src}
                        alt="Featured Premium Tech Accessory"
                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Dynamic Native Grid Showcase */}
      <section id="featured-products" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          title="Featured Collection"
          subtitle="Engineered for efficiency. Browse architectural mobile hardware accessories."
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
                  const image = product.images?.[0]?.image || null;

                  return (
                    <motion.div
                      key={product.id}
                      variants={cardVariants}
                      onClick={handleActionClick}
                      className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
                    >
                      {/* Image Frame Container */}
                      <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-50">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+";
                            }}
                          />
                        ) : (
                          <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">No Image Available</span>
                        )}

                        {/* Modern High-End Hover Filter Veil */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[3px] flex items-center justify-center">
                          <span className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            {isLoggedIn ? "View Specifications" : "Login to Checkout ↗"}
                          </span>
                        </div>
                      </div>

                      {/* Content Block */}
                      <div className="p-5 flex flex-col flex-1 space-y-3">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-bold text-lg text-slate-900 tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xl font-black text-slate-900">
                            ${formatPrice(product.price)}
                          </span>
                          <span className="text-xs font-semibold text-indigo-500 bg-indigo-100 px-2.5 py-1 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
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

      {/* Rest of components (Features / Footer) unchanged but clean */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSectionHeader title="Operational Standards" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "📦", title: "Free Global Shipping", description: "Complimentary priority routing protection applied to all packages over $50." },
              { icon: "🛡️", title: "Encrypted Transactions", description: "Direct layer handshake guarantees credential token security during transit." },
              { icon: "💎", title: "Quality Benchmarks", description: "All structural accessories carry structural device matching assurances." },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                <span className="text-4xl block mb-4">{feature.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Ecosystem */}
      {/* Footer Ecosystem */}
<footer id="contact-us" className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
    <div className="flex items-center space-x-3 text-white font-bold text-lg group">
      {/* Premium Gradient Frame for your SVG */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-md transition-all duration-300">
        <svg 
          className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
        </svg>
      </div>
      <span className="tracking-tight">PriceTag</span>
    </div>
    <p>© 2026 PriceTag. Architecture System Infrastructure.</p>
  </div>
</footer>
    </div>
  );
};

export default HomePage;