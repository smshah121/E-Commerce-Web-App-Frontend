import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useGetAllProductsQuery } from "../../feature/product/productApi";
import Navbar from "./Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ─── Fonts ─────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    :root {
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'DM Sans', sans-serif;
      --c-ink: #0f0e0c;
      --c-cream: #faf8f4;
      --c-warm: #f0ede6;
      --c-gold: #c9a84c;
      --c-gold-light: #f0d990;
      --c-charcoal: #2c2a26;
      --c-muted: #7a7870;
      --c-accent: #1a3a5c;
      --c-accent-light: #d6e4f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-body); background: var(--c-cream); color: var(--c-ink); }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─── Ticker ─────────────────────────────────────────────── */
const Ticker = () => {
  const items = ["Free shipping on orders over $50", "Premium Mobile Accessories", "Secure Checkout", "30-Day Returns", "Authentic Products Only", "New arrivals every week"];
  return (
    <div style={{ background: "var(--c-gold)", overflow: "hidden", height: 36, display: "flex", alignItems: "center" }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", gap: "4rem" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-ink)" }}>
            {item} <span style={{ opacity: 0.4, marginLeft: "2rem" }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Hero ────────────────────────────────────────────────── */
const Hero = ({ onScrollToProducts }) => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 400], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const slides = [
    { src: "/magsafe belkin.jpg", label: "MagSafe Series" },
    { src: "/45W PowerBank.jpg", label: "Power Bank" },
    { src: "/adaptor.jpg", label: "Adapters" },
    { src: "/Airpods max.jpg", label: "AirPods Max" },
    { src: "/apple earphones.jpg", label: "Earphones" },
  ];

  return (
    <section style={{ position: "relative", height: "92vh", minHeight: 600, overflow: "hidden", background: "var(--c-charcoal)" }}>
      {/* Full-bleed swiper */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          style={{ height: "100%" }}
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div style={{ position: "relative", height: "100%" }}>
                <img src={s.src} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,14,12,0.85) 40%, rgba(15,14,12,0.2) 100%)" }} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Hero copy */}
      <motion.div style={{ y: yText, opacity, position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw", maxWidth: 800 }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: 20 }}
        >
          Premium Collection 2025
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05, color: "#fff", marginBottom: 24 }}
        >
          Accessories<br />
          <em style={{ color: "var(--c-gold)", fontStyle: "italic" }}>Worth Having.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.4vw, 1.15rem)", color: "rgba(255,255,255,0.7)", maxWidth: 460, lineHeight: 1.7, marginBottom: 40 }}
        >
          Curated mobile accessories where design meets performance. Every item chosen for quality, not just price.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onScrollToProducts}
            style={{ background: "var(--c-gold)", color: "var(--c-ink)", border: "none", padding: "14px 36px", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Shop Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onScrollToProducts}
            style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "14px 36px", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
          >
            View Catalogue
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <span style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(201,168,76,0.8), transparent)" }} />
      </motion.div>
    </section>
  );
};

/* ─── Stats bar ──────────────────────────────────────────── */
const StatsBar = () => {
  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Products" },
    { value: "48hr", label: "Fast Delivery" },
    { value: "4.9★", label: "Avg Rating" },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{ background: "var(--c-accent)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1 + 0.2 }}
          style={{ padding: "28px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--c-gold)", fontWeight: 700 }}>{s.value}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{s.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ─── Category Pills ─────────────────────────────────────── */
const categories = ["All", "MagSafe", "Power Banks", "Adapters", "Audio", "Cases"];
const CategoryFilter = ({ active, onChange }) => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 56 }}>
    {categories.map((cat) => (
      <motion.button
        key={cat}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onChange(cat)}
        style={{
          padding: "9px 22px",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          border: active === cat ? "1px solid var(--c-accent)" : "1px solid #d4d0c8",
          background: active === cat ? "var(--c-accent)" : "transparent",
          color: active === cat ? "#fff" : "var(--c-muted)",
          transition: "all 0.2s",
        }}
      >
        {cat}
      </motion.button>
    ))}
  </div>
);

/* ─── Product Card ────────────────────────────────────────── */
const ProductCard = ({ product, index, onClick, formatPrice }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });
  const image = product.images?.[0]?.image || null;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      style={{ background: "#fff", border: "1px solid #e8e4dc", cursor: "pointer", display: "flex", flexDirection: "column", transition: "box-shadow 0.3s", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "var(--c-warm)" }}>
        {image ? (
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
            src={image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--c-muted)", letterSpacing: "0.1em" }}>No Image</span>
          </div>
        )}
        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ position: "absolute", inset: 0, background: "rgba(26,58,92,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>View Details</div>
            <div style={{ width: 32, height: 1, background: "var(--c-gold)", margin: "0 auto" }} />
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--c-ink)", lineHeight: 1.3 }} className="line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--c-muted)", lineHeight: 1.6 }} className="line-clamp-3">
            {product.description}
          </p>
        )}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f0ede6" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--c-accent)" }}>
            ${formatPrice(product.price)}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 500 }}>
            In Stock
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Features Strip ─────────────────────────────────────── */
const FeaturesStrip = () => {
  const features = [
    { icon: "📦", title: "Free Shipping", desc: "On orders over $50 worldwide" },
    { icon: "🔒", title: "Secure Payment", desc: "256-bit SSL encrypted checkout" },
    { icon: "↩", title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: "⭐", title: "Guaranteed Quality", desc: "Every product hand-vetted" },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section ref={ref} style={{ background: "var(--c-warm)", padding: "72px 5vw", borderTop: "1px solid #e8e4dc", borderBottom: "1px solid #e8e4dc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12 }}
            style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--c-ink)", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--c-muted)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ─── Newsletter ─────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section ref={ref} style={{ background: "var(--c-charcoal)", padding: "100px 5vw" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}
      >
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: 16 }}>Stay Informed</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
          Exclusive offers,<br /><em style={{ color: "var(--c-gold)" }}>before anyone else.</em>
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 36, lineHeight: 1.7 }}>
          Join our list for new arrivals, flash sales, and curated picks delivered monthly.
        </p>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.p key="thanks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--c-gold)" }}>
              ✓ You're on the list.
            </motion.p>
          ) : (
            <motion.div key="form" style={{ display: "flex", gap: 0 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, padding: "14px 20px", fontFamily: "var(--font-body)", fontSize: 14, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
              />
              <motion.button
                whileHover={{ background: "#b8913d" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { if (email) setSent(true); }}
                style={{ padding: "14px 28px", background: "var(--c-gold)", color: "var(--c-ink)", border: "none", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer" }}
              >
                Subscribe
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

/* ─── Footer ─────────────────────────────────────────────── */
const Footer = () => (
  <footer id="contact-us" style={{ background: "#0a0908", color: "rgba(255,255,255,0.5)", padding: "60px 5vw 30px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "48px 32px", marginBottom: 56 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Price<span style={{ color: "var(--c-gold)" }}>Tag</span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>
            Premium mobile accessories, curated for those who care about quality.
          </p>
        </div>
        {[
          { title: "Company", links: ["About Us", "Press", "Careers", "Contact"] },
          { title: "Support", links: ["Help Center", "Return Policy", "Track Order", "Shipping Info"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
        ].map((col, i) => (
          <div key={i}>
            <h4 style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>{col.title}</h4>
            <ul style={{ listStyle: "none" }}>
              {col.links.map((l, j) => (
                <li key={j} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "var(--c-gold)"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12 }}>© 2025 PriceTag. All rights reserved.</span>
        <div style={{ display: "flex", gap: 16 }}>
          {["F", "X", "IG", "LI"].map((s, i) => (
            <a key={i} href="#" style={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = "var(--c-gold)"; e.target.style.color = "var(--c-gold)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.4)"; }}
            >{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Main ────────────────────────────────────────────────── */
const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: products = [], isLoading } = useGetAllProductsQuery();
  const { token, role } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);
  const navigate = useNavigate();

  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - navHeight, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <FontImport />
      <div style={{ minHeight: "100vh", background: "var(--c-cream)", color: "var(--c-ink)" }}>
        <Ticker />
        <Navbar isLoggedIn={isLoggedIn} role={role} onScrollToSection={handleScrollToSection} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <Hero onScrollToProducts={() => handleScrollToSection("featured-products")} />
        <StatsBar />

        {/* Products Section */}
        <section id="featured-products" style={{ padding: "100px 5vw" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: 12 }}
              >
                Handpicked for You
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: "var(--c-ink)", marginBottom: 16 }}
              >
                Featured Products
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                style={{ width: 48, height: 2, background: "var(--c-gold)", margin: "0 auto" }}
              />
            </div>

            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: 40, height: 40, border: "2px solid var(--c-gold)", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px" }}
                />
                <p style={{ fontFamily: "var(--font-body)", color: "var(--c-muted)", fontSize: 14 }}>Loading products…</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--c-muted)" }}>No products found</p>
              </div>
            ) : (
              <>
                <div id="products" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      formatPrice={formatPrice}
                      onClick={() => navigate("/login")}
                    />
                  ))}
                </div>
                {filteredProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: "center", marginTop: 64 }}
                  >
                    <motion.button
                      whileHover={{ background: "var(--c-accent)", color: "#fff" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/login")}
                      style={{ padding: "14px 48px", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", border: "1px solid var(--c-accent)", background: "transparent", color: "var(--c-accent)", transition: "all 0.25s" }}
                    >
                      View All Products
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>

        <FeaturesStrip />

        {/* Why PriceTag Section */}
        <section id="why-choose-myshop" style={{ padding: "100px 5vw", background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px 60px", alignItems: "center" }}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: 16 }}>Our Promise</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--c-ink)", lineHeight: 1.2, marginBottom: 24 }}>
                  Why Discerning<br />Buyers Choose Us
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--c-muted)", lineHeight: 1.8 }}>
                  We source only the finest mobile accessories from trusted manufacturers. Every product undergoes rigorous quality checks before reaching your hands. No compromises, no imitations.
                </p>
              </motion.div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { num: "01", title: "Curated Selection", desc: "Only products that meet our strict quality bar" },
                  { num: "02", title: "Expert Support", desc: "Real humans ready to help, 7 days a week" },
                  { num: "03", title: "Fast Delivery", desc: "Nationwide coverage, orders ship same day" },
                  { num: "04", title: "Easy Returns", desc: "Not happy? Return within 30 days, no questions" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{ padding: "24px 20px", border: "1px solid #e8e4dc" }}
                  >
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--c-gold-light)", marginBottom: 10 }}>{item.num}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--c-ink)", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--c-muted)", lineHeight: 1.6 }}>{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;