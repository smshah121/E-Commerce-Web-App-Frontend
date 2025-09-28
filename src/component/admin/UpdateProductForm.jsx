import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdateProductMutation } from '../../feature/product/productApi';
import { FaEdit, FaTimes, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const formVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.95 },
  visible: { opacity: 1, height: 'auto', scale: 1 },
  exit: { opacity: 0, height: 0, scale: 0.95 },
};

const UpdateProductForm = ({ product }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || product?.title || '',
    price: product?.price || '',
    description: product?.description || '',
  });

  const [updateProduct, { isLoading, isSuccess, isError, error, reset }] = useUpdateProductMutation();

  // Update form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || product.title || '',
        price: product.price || '',
        description: product.description || '',
      });
    }
  }, [product]);

  // Auto-hide form on success and reset mutation state
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setShowForm(false);
        reset(); // Reset the mutation state
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) {
      console.error('Product ID is missing');
      return;
    }

    try {
      await updateProduct({ id: product.id, ...formData }).unwrap();
      // Success is handled by the useEffect above
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    // Reset form to original values
    setFormData({
      name: product?.name || product?.title || '',
      price: product?.price || '',
      description: product?.description || '',
    });
    // Reset any error states
    if (isError) {
      reset();
    }
  };

  return (
    <div className="space-y-4">
      {/* Edit Button */}
      {!showForm && (
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-100 transition-all duration-300 flex items-center justify-center text-sm border border-blue-200"
        >
          <FaEdit className="mr-2" /> Edit Product
        </motion.button>
      )}

      {/* Update Form (Animated) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="update-form"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white rounded-xl shadow-inner p-6 border border-gray-200"
          >
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaEdit className="mr-2 text-blue-500" /> Edit Product Details
            </h4>

            {/* Form inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-green-600 text-sm flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <FaCheckCircle className="mr-2" /> 
                    Product updated successfully! Changes will appear automatically.
                  </motion.div>
                )}
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-red-600 text-sm flex items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <FaExclamationCircle className="mr-2" /> 
                    Error: {error?.data?.message || 'Failed to update product.'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="flex-1 bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" />
                      Update Product
                    </>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <FaTimes />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpdateProductForm;