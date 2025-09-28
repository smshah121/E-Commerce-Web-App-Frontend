import React from 'react';
import { useGetBuyersByProductQuery } from '../../feature/order/orderApi';
import { FaUserCircle, FaBox, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProductBuyersList = ({ productId }) => {
  const { data: buyers = [], isLoading } = useGetBuyersByProductQuery(productId);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // No buyers found state
  if (!buyers || buyers.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center border border-gray-200">
        <FaInfoCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">No Buyers Yet</h3>
        <p className="text-gray-500 mt-2">This product has not been purchased by any customers.</p>
      </div>
    );
  }

  // Buyers list
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Buyers for this Product</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {buyers.map((buyer, index) => (
            <motion.div
              key={buyer.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between transition-shadow duration-300 hover:shadow-md"
            >
              <div className="flex items-center space-x-4 mb-3 md:mb-0">
                <FaUserCircle className="text-4xl text-blue-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{buyer.name}</p>
                  <p className="text-sm text-gray-500">{buyer.email}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaBox className="text-md" />
                  <p className="text-sm">Quantity: <span className="font-medium text-gray-800">{buyer.quantity}</span></p>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaCalendarAlt className="text-md" />
                  <p className="text-sm">Ordered: <span className="font-medium text-gray-800">{new Date(buyer.orderDate).toLocaleDateString()}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductBuyersList;