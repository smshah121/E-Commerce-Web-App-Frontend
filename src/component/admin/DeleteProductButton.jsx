import { motion, AnimatePresence } from 'framer-motion';
import { useDeleteProductMutation } from '../../feature/product/productApi';
import { FaRegTrashAlt, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useState } from 'react';

const DeleteProductButton = ({ productId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteProduct, { isLoading, isError, isSuccess, error }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct(productId).unwrap();
      // Wait a moment for the success message to show before closing
      setTimeout(() => setShowConfirm(false), 2000);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: { y: -50, opacity: 0, scale: 0.8 },
    visible: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 50, opacity: 0, scale: 0.8 },
  };

  return (
    <>
      <motion.button
        onClick={() => setShowConfirm(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full text-red-600 bg-red-50 py-2 px-4 rounded-lg shadow-sm hover:bg-red-100 transition-all duration-300 flex items-center justify-center text-sm font-semibold border border-red-200"
        disabled={isLoading}
      >
        <FaRegTrashAlt className="mr-2" /> Delete Product
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              {isSuccess ? (
                <>
                  <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Deletion Successful</h3>
                  <p className="text-gray-700 mb-6">The product has been successfully removed.</p>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </p>
                </>
              )}
              
              {isError && (
                <p className="text-red-500 text-sm mb-4">Error: {error?.data?.message || 'Failed to delete product.'}</p>
              )}

              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={() => setShowConfirm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete Anyway'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteProductButton;