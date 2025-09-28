import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from './NavbarCust'; // Assuming your CustomerNavbar is here
import { motion } from 'framer-motion'; // Import motion for animations
import { FaBoxOpen, FaShoppingCart, FaMapMarkedAlt } from 'react-icons/fa'; // Icons for empty state and order items, added FaMapMarkedAlt
import { useGetMyOrderQuery } from '../../feature/order/orderApi';

const MyOrders = () => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    navigate("/customer-dashboard");
  };

  const { data: orders = [], isLoading } = useGetMyOrderQuery();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
      case 'completed': // Added 'completed' as a delivered status
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
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
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Your Orders</h2>
          <p className="text-gray-500">Please wait while we fetch your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar /> {/* Include the Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20"> {/* Add pt-20 for navbar clearance */}
        <motion.button
          onClick={() => getDashboardPath()}
          className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="mr-2">←</span>
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FaBoxOpen className="text-white text-xl" /> {/* Replaced emoji with icon */}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage all your orders in one place</p>
        </motion.div>

        {/* Orders Content */}
        {orders.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.5 }}
          >
            <div className="mb-6">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="text-5xl text-gray-400" /> {/* Replaced emoji with icon */}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button
                onClick={() => navigate('/customer-dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                variants={itemVariants}
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-4 mb-3 lg:mb-0">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        #{order.id}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.orderedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${parseFloat(order.total)?.toFixed(2) || '0.00'} {/* Use parseFloat here */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipment Address */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FaMapMarkedAlt className="mr-2 text-blue-600" /> Shipment Address
                  </h4>
                  <p className="text-gray-700">{order.street}, {order.city}, {order.state}, {order.postalCode}, {order.country}</p>
                </div>

                {/* Order Items Preview */}
                <div className="px-6 py-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📦</span>
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => ( // Show first 2 items as preview
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <img
                            src={item.product?.images?.[0]?.images?.[0] ? `http://localhost:3000${item.product.images[0].images[0]}` : `https://placehold.co/60x60/E0E7FF/3B82F6?text=Item`}
                            alt={item.product?.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMC4wNTE2QzI1LjQxNzUgMjAuMDUxNiAyMS43NSAyMy43MTk2IDIx.75IDI4LjMwMTZTMjUuNDE3NSAzNi41NTE2IDMwIDM2LjU1MTZTMzguMjUgMzIuODgyNiAzOC4yNSAyOC4zMDE2UzM0LjU4MjUgMjAuMDUxNiAz Moe 3MCIDIyLjA1MTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPg=="; }}
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</h5>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.product?.price ? parseFloat(item.product.price) * item.quantity : 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600 text-center mt-2">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <button
                      onClick={() => navigate(`/my-orders/${order.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                    >
                      View Details
                    </button>

                    {order.status?.toLowerCase() === 'delivered' && (
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200">
                        Reorder
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Order Total: <span className="font-semibold text-gray-900">${parseFloat(order.total)?.toFixed(2) || '0.00'}</span> {/* Use parseFloat here */}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Orders Summary */}
        {orders.length > 0 && (
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-gray-600">Total Orders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(order => order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed').length}
                </p>
                <p className="text-gray-600">Delivered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  ${orders.reduce((total, order) =>
                    total + (order.total ? parseFloat(order.total) : 0), 0 // Use parseFloat here
                  ).toFixed(2)}
                </p>
                <p className="text-gray-600">Total Spent</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
