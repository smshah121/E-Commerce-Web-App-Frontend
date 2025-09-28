import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import CustomerNavbar from './NavbarCust';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { useGetProductByIdQuery } from '../../feature/product/productApi';
import { addToCart } from '../../feature/cart/cartSlice';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Check if user is logged in (assuming auth state is in Redux)
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  // Fetch product data using RTK Query
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  
  // Process images safely using useMemo
  const allImages = useMemo(() => {
    if (!product?.images) return [];
    return product.images.flatMap((imgObj) => imgObj.images.map(img => `http://localhost:3000${img}`));
  }, [product]);

  // Set initial selected image when images are loaded
  useEffect(() => {
    if (allImages.length > 0 && !selectedImage) {
      setSelectedImage(allImages[0]);
    }
  }, [allImages, selectedImage]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      setAddedToCartFeedback(true);
      setTimeout(() => setAddedToCartFeedback(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      navigate('/login');
      return;
    }
    if (product) {
      // Add to cart first (or a temporary "buy now" state if preferred)
      dispatch(addToCart({ ...product, quantity }));
      // Then immediately navigate to the checkout page
      navigate('/checkout');
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
          <p className="text-gray-700 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold mb-2">Error loading product:</p>
          <p className="text-lg">{error.message || 'An unknown error occurred.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-700">
          <p className="text-xl font-semibold mb-2">Product not found.</p>
          <p className="text-lg">The product you are looking for does not exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            whileHover={{ x: -5 }}
          >
            <FaArrowLeft className="mr-2" /> Back to Products
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Product Images Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className="space-y-4"
            >
              {/* Main Selected Image */}
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected Product"
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No Image Available</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 object-contain border-2 rounded-md cursor-pointer transition-all duration-300 flex-shrink-0 ${
                        selectedImage === img
                          ? 'border-blue-500 ring-2 ring-blue-300'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details Section */}
            <div className="flex flex-col">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight"
              >
                {product.name}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-2xl font-bold text-blue-600 mb-4"
              >
                ${formatPrice(product.price)}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gray-700 text-lg mb-6 leading-relaxed"
              >
                {product.description || "A high-quality mobile accessory designed to enhance your device's functionality and style. Crafted with premium materials for durability and a perfect fit."}
              </motion.p>

              {/* Product Specifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mb-6 text-gray-600 border-t border-b border-gray-200 py-4"
              >
                <p className="mb-2">
                  <span className="font-semibold">Category:</span> {product.category || 'Mobile Accessories'}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Brand:</span> {product.brand || 'Generic'}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Availability:</span> In Stock
                </p>
                <p>
                  <span className="font-semibold">Shipping:</span> Free 2-day shipping to major cities
                </p>
              </motion.div>

              {/* Quantity Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center space-x-4 mb-6"
              >
                <label htmlFor="quantity" className="font-semibold text-gray-800">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </motion.div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <motion.button
                  onClick={handleAddToCart}
                  className={`flex-1 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center ${
                    addedToCartFeedback
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-200 hover:shadow-xl'
                  }`}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {addedToCartFeedback ? (
                    <>
                      <MdCheckCircle className="mr-3 text-2xl" /> Added!
                    </>
                  ) : (
                    <>
                      <AiOutlineShoppingCart className="mr-3 text-2xl" /> Add to Cart
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(255, 165, 0, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;