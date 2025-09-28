import React, { useState } from 'react';
import UpdateOrderStatus from './UpdateOrderStatus';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetOrdersForAdminQuery } from '../../feature/order/orderApi'; // ✅ updated
import { FaBoxOpen, FaUser, FaDollarSign, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)"
  },
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Processing': return 'bg-blue-100 text-blue-800';
    case 'Shipped': return 'bg-purple-100 text-purple-800';
    case 'Delivered': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderListForAdmin = () => {
  const { data: orders = [], isLoading, isError, refetch } = useGetOrdersForAdminQuery(undefined, {refetchOnMountOrArgChange:true}); // ✅ only current admin
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Loading Orders...</h3>
          <p className="text-gray-500">Please wait while we fetch your orders.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="bg-red-50 rounded-2xl border border-red-200 p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600">Failed to retrieve your order data.</p>
        </div>
      </motion.div>
    );
  }

  return (
    
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Product Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <div className="h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-gray-500">No orders found for your products.</p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-6"
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <FaBoxOpen className="text-3xl text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Order ID</p>
                    <p className="text-lg font-bold text-gray-900">#{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-green-600">${order.total}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-6">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-lg text-purple-500" />
                  <div>
                    <p className="font-semibold">Customer</p>
                    <p className="text-sm text-gray-700">{order.customer?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-lg text-yellow-500" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-sm text-gray-700">
                      {new Date(order.orderedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaDollarSign className="text-lg text-green-500" />
                  <div>
                    <p className="font-semibold">Payment</p>
                    <p className="text-sm text-gray-700">Cash On Delivery</p>
                  </div>
                </div>
              </div>

              {/* Order items expand */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => toggleDetails(order.id)}
                  className="w-full flex items-center justify-between text-left text-blue-600 font-semibold py-2"
                >
                  <span>{expandedOrder === order.id ? 'Hide Details' : 'View Details'}</span>
                  <FaChevronDown
                    className={`transform transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 space-y-3">
                        {order.items?.map(item => (
                          <li
                            key={item.productId}
                            className="flex items-center space-x-4 bg-white p-3 rounded-md shadow-sm"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-md" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderListForAdmin;
