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

const AdminDashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <WelcomeBanner />
      </div>

      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-black opacity-10"
        />
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            >
              Seller Dashboard
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              Manage your products, inventory, and store operations with ease
            </motion.p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 left-10 w-12 h-12 bg-yellow-400/20 rounded-full blur-sm"
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500"
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
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"
                />
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-semibold text-gray-700 mb-2"
                >
                  Loading Products
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500"
                >
                  Please wait while we fetch your inventory...
                </motion.p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
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
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Error Loading Products
                </h3>
                <p className="text-red-600">
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
              className="grid gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  whileHover="hover"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Product Info */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.title}
                          </h2>
                          <div className="flex items-center space-x-4 mb-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                            >
                              ${formatPrice(product.price)}
                            </motion.div>
                            <div className="flex items-center space-x-1">
                              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                ID: {product.id}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-2xl leading-relaxed">
                            {product.name}
                          </p>
                          <p className="text-gray-600 leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <UpdateProductForm product={product} />
                        <AddProductImage productId={product.id} />
                        {/* New Delete Product Button */}
                        <DeleteProductButton productId={product.id} />

                        <ProductBuyersList productId={product.id} />
                      </div>
                    </div>

                    {/* Product Images */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-gray-900">
                        Product Images ({product.images?.length || 0})
                      </h4>

                      {product.images?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {product.images.map((img) =>
                            img.images.map((path, idx) => {
                              const API_URL = import.meta.env.VITE_API_URL;
                              const fullPath = `${API_URL.replace(
                                /\/$/,
                                ""
                              )}${path}`;
                              return (
                                <motion.div
                                  key={`${img.id}-${idx}`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="relative group"
                                >
                                  <img
                                    src={fullPath}
                                    alt={`Product ${product.id} - ${idx}`}
                                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300"
                                    onError={(e) => {
                                      console.error(
                                        "Image failed to load:",
                                        fullPath
                                      );
                                      e.target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0E0IDQgMCAwIDAgMTcgM0g3QTQgNCAwIDAgMCAzIDdWMTdBNCA0IDAgMCAwIDcgMjFIOUwyMSA5WiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjEgMTVMMTMgN0w5IDExIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvcGF0aD4KPC9zdmc+";
                                      e.target.className =
                                        "w-full h-32 object-cover rounded-xl border-2 border-red-300 bg-gray-100 flex items-center justify-center";
                                    }}
                                    onLoad={() => {
                                      console.log(
                                        "Image loaded successfully:",
                                        fullPath
                                      );
                                    }}
                                  />
                                  <DeleteImageButton imageId={img.id} />
                                </motion.div>
                              );
                            })
                          )}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <svg
                              className="w-12 h-12 text-gray-400 mx-auto mb-2"
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
                            <p className="text-gray-500 text-sm">
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
          <OrderListForAdmin />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
