import React, { useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import AddProductImage from "./AddProductImage";
import UpdateProductForm from "./UpdateProductForm";
import DeleteImageButton from "./DeleteImageButton";
import DeleteProductButton from "./DeleteProductButton"; // Import the new component
import { useNavigate } from "react-router-dom";
import CreateProductForm from "./CreateProduct";
// import { useGetAllProductsQuery } from '../../feature/product/productApi';
import WelcomeBanner from "./WelcomeBanner"; // Assuming WelcomeBanner is a separate component
import ProductBuyersList from "./ProductBuyersList";

import { useGetAllOrdersQuery } from "../../feature/order/orderApi";
import OrderListForAdmin from "./OrderListForAdmin";
import { useGetMyProductsQuery } from "../../feature/product/productApi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const SellerDashboard = () => {
  // const { data: products = [], isLoading, error } = useGetAllProductsQuery();
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetMyProductsQuery();
  const getAdminIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded?.sub || null;
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  };
  const adminId = getAdminIdFromToken();
  useEffect(() => {
    if (adminId) {
      refetch(); // refetch data if admin ID changes
    }
  }, [adminId]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const { data: orders = [], isLoading: ordersLoading } =
    useGetAllOrdersQuery();

  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // or sessionStorage
    navigate("/login"); // redirect to login
  };

  // Component for animated section headers
  const AnimatedSectionHeader = ({ title, subtitle, icon }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="text-center mb-12"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center mb-4"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mr-4"
          >
            <span className="text-3xl">{icon}</span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          >
            {title}
          </motion.h2>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4"
        />
        {subtitle && (
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
    <WelcomeBanner />
  </div>

  {/* Hero Header */}
  <section className="relative bg-black text-white border-y border-neutral-800 overflow-hidden mt-6">
    {/* Minimalist Grid Pattern Background */}
    <motion.div
      style={{ y }}
      className="absolute inset-0 bg-neutral-900 opacity-20"
    />
    <motion.div
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        duration: 25,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "60px 60px",
      }}
    />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight"
        >
          Seller Dashboard
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Manage your products, inventory, and store operations with precision and simplicity
        </motion.p>
      </motion.div>
    </div>

    {/* Subtle Floating Ambient Accent */}
    <motion.div
      animate={{
        y: [0, -15, 0],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-12 right-12 w-24 h-24 bg-neutral-700/20 rounded-full blur-xl"
    />
  </section>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    {/* Create Product Section */}
    <section>
      <AnimatedSectionHeader
        title="Add New Product"
        subtitle="Create and add new products to your inventory"
        icon="➕"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-6 md:p-8 hover:border-neutral-300 transition-all duration-300"
      >
        <CreateProductForm />
      </motion.div>
    </section>

    {/* Products List Section */}
    <section>
      <AnimatedSectionHeader
        title="Product Inventory"
        subtitle="View and manage all your products in one place"
        icon="📦"
      />

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-20 bg-white rounded-2xl border border-neutral-200/80 shadow-sm"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-12 w-12 border-2 border-black border-t-transparent mb-4"
            />
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold text-neutral-900 mb-1 tracking-tight"
            >
              Loading Products
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-neutral-400 font-light"
            >
              Please wait while we fetch your inventory...
            </motion.p>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-8 shadow-md">
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-neutral-700">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold mb-1 tracking-tight">
              Error Loading Products
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              {error.message || "Unknown error occurred"}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
          className="grid gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-neutral-200/90 hover:border-neutral-400 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
                        {product.title}
                      </h2>
                      <div className="flex items-center space-x-3 mb-3">
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-2xl font-black text-neutral-900"
                        >
                          ${formatPrice(product.price)}
                        </motion.div>
                        <span className="bg-neutral-100 text-neutral-800 border border-neutral-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          ID: #{product.id}
                        </span>
                      </div>
                      <p className="text-neutral-800 text-lg font-medium leading-snug mb-2">
                        {product.name}
                      </p>
                      <p className="text-neutral-500 text-sm leading-relaxed font-light">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <UpdateProductForm product={product} />
                    <AddProductImage productId={product.id} />
                    <DeleteProductButton productId={product.id} />
                    <ProductBuyersList productId={product.id} />
                  </div>
                </div>

                {/* Product Images */}
                <div className="space-y-3 border-t lg:border-t-0 lg:border-l border-neutral-200/80 pt-6 lg:pt-0 lg:pl-8">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                    Product Images ({product.images?.length || 0})
                  </h4>

                  {product.images?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {product.images.map((img) => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="relative group rounded-xl overflow-hidden"
                        >
                          <img
                            src={img.image}
                            alt={img.altText || `Product ${product.id}`}
                            className="w-full h-28 object-cover rounded-xl border border-neutral-200 group-hover:border-black transition-all duration-300"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQi...";
                              e.target.alt = "Image not available";
                              e.target.className =
                                "w-full h-28 object-cover rounded-xl border border-neutral-300 bg-neutral-100 flex items-center justify-center";
                            }}
                          />
                          <DeleteImageButton imageId={img.id} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-28 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 flex items-center justify-center"
                    >
                      <div className="text-center p-4">
                        <svg
                          className="w-8 h-8 text-neutral-300 mx-auto mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-neutral-400 text-xs font-light">
                          No images available
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>

    {/* Orders Management Section */}
    <section>
      <AnimatedSectionHeader
        title="Manage Orders"
        subtitle="View and update order status"
        icon="📋"
      />
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-6 md:p-8">
        <OrderListForAdmin />
      </div>
    </section>
  </div>
</div>
  );
};

export default SellerDashboard;
