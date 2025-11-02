import React, { useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerNavbar from './NavbarCust'; // Assuming your CustomerNavbar is here
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaTruck, FaClipboardCheck } from 'react-icons/fa'; // Added FaTruck and FaClipboardCheck
import { useGetOrderByIdQuery } from "../../feature/order/orderApi";

const OrderDetail = () => {
  const { orderId } = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false); // State to control tracking visibility

  // Use the specific useGetOrderByIdQuery hook directly
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  // Mock tracking history for demonstration purposes
  // In a real app, this would come from your backend order data
  const mockTrackingHistory = [
    { status: 'Order Placed', date: new Date(order?.orderedAt).toLocaleString(), location: 'Online Store' },
    { status: 'Processing', date: new Date(new Date(order?.orderedAt).getTime() + 60 * 60 * 1000).toLocaleString(), location: 'Warehouse' },
    { status: 'Shipped', date: new Date(new Date(order?.orderedAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString(), location: 'Transit Hub' },
    { status: 'Out for Delivery', date: new Date(new Date(order?.orderedAt).getTime() + 48 * 60 * 60 * 1000).toLocaleString(), location: 'Local Delivery Center' },
    { status: 'Delivered', date: new Date(new Date(order?.orderedAt).getTime() + 72 * 60 * 60 * 1000).toLocaleString(), location: 'Customer Address' },
  ].filter(entry => {
    // Only show tracking steps up to the current order status
    const orderStatusIndex = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'].indexOf(order?.status?.toLowerCase());
    const trackingStatusIndex = ['order placed', 'processing', 'shipped', 'out for delivery', 'delivered'].indexOf(entry.status.toLowerCase());
    return trackingStatusIndex <= orderStatusIndex;
  });


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

  const calculateItemTotal = (item) => {
    // Ensure item.product and item.product.price exist before calculation
    return (item.product?.price ? parseFloat(item.product.price) * item.quantity : 0).toFixed(2);
  };

  // Removed calculateOrderTotal as order.subtotal, order.shipping, order.tax, order.total are directly available

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
          <p className="text-gray-700 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold mb-2">Error loading order:</p>
          <p className="text-lg">{error.message || 'An unknown error occurred.'}</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-700">
          <p className="text-xl font-semibold mb-2">Order not found.</p>
          <p className="text-lg">The order you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.button
            onClick={() => navigate('/my-orders')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            whileHover={{ x: -5 }}
          >
            <FaArrowLeft className="mr-2" /> Back to My Orders
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-10"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order Details #{order.id}</h1>

            {/* Order Header/Status */}
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Placed On: {new Date(order.orderedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">Order ID: <span className="font-mono text-gray-800">{order.id}</span></p>
              </div>
              <span className={`mt-4 sm:mt-0 px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(order.status)}`}>
                {order.status || 'Pending'}
              </span>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaShoppingCart className="mr-3 text-purple-600" /> Items in Order ({order.items.length})
              </h2>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      {/* Product Image */}
                      <img
                        src={item.product?.images?.[0]?.images?.[0]
                          ? `${API_URL}${item.product.images[0].images[0]}`
                          : `https://placehold.co/80x80/E0E7FF/3B82F6?text=${encodeURIComponent(item.product?.name || 'Item')}`}
                        alt={item.product?.name || 'Product'}
                        className="w-20 h-20 object-contain rounded-md shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMC4wNTE2QzI1LjQxNzUgMjAuMDUxNiAyMS43NSAyMy43MTk2IDIxLjc1IDI4LjMwMTZTMjUuNDE3NSAzNi41NTE2IDMwIDM2LjU1MTZTMzguMjUgMzIuODgyNiAzOC4yNSAyOC4zMDE2UzM0LjU4MjUgMjAuMDUxNiAzMCAyMC4wNTE2Wk0zMCAyMy4wNTE2QzMyLjYyNSAyMy4wNTE2IDM0LjM3NSAyOC4wNTE2IDM0LjM3NSAyOS41NTE2UzMyLjYyNSAzMS4wNTE2IDMwIDM3LjA1MTZTMjUuNjI1IDMxLjA1MTYgMjUuNjI1IDI5LjU1MTZTMjcuMTM1IDIzLjA1MTYgMzAgMjIuMDUxNloiIGZpbGw9IiM5QjlCRTAiLz4KPC9zdmc+"; }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{item.product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-blue-600">${item.product?.price ? parseFloat(item.product.price).toFixed(2) : 'N/A'} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${calculateItemTotal(item)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipment Address */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-green-600" /> Shipment Address
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                {order.street ? ( // Check if street exists to determine if address data is present
                  <div className="text-gray-700 space-y-1">
                    <p className="font-medium">{order.street}</p>
                    <p>{order.city}, {order.state} {order.postalCode}</p>
                    <p>{order.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">No shipment address available for this order.</p>
                )}
              </div>
            </div>

            {/* Order Totals */}
            <div className="space-y-3 text-lg p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaMoneyBillWave className="mr-3 text-teal-600" /> Payment Summary
              </h2>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${parseFloat(order.subtotal || 0).toFixed(2)}</span> {/* Use order.subtotal */}
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                {/* Display 'Free' if shipping is 0, otherwise display the amount */}
                {(order.shipping || 0) === 0 ? (
                  <span className="font-semibold text-green-600">Free</span>
                ) : (
                  <span>${parseFloat(order.shipping || 0).toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax:</span>
                <span>${parseFloat(order.tax || 0).toFixed(2)}</span> {/* Use order.tax */}
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-200 pt-3 mt-3">
                <span>Total Paid:</span>
                <span>${parseFloat(order.total || 0).toFixed(2)}</span> {/* Use order.total directly */}
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Payment Method: Cash on Delivery
              </p>
            </div>

            {/* Track Order Section */}
            <div className="mt-8">
              <button
                onClick={() => setShowTracking(!showTracking)}
                className="w-full flex items-center justify-center py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-teal-500 to-green-600 text-white hover:from-teal-600 hover:to-green-700"
              >
                <FaTruck className="mr-3 text-2xl" />
                {showTracking ? 'Hide Tracking Details' : 'Track Order'}
              </button>

              {showTracking && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaClipboardCheck className="mr-2 text-teal-600" /> Order Tracking Timeline
                  </h3>
                  <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-4">                  
                    {mockTrackingHistory.map((entry, index) => (
                      <li key={index} className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-50 dark:bg-blue-900">
                          {index === mockTrackingHistory.length - 1 && (order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed') ? (
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                          ) : (
                            <svg className="w-3 h-3 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                          )}
                        </span>
                        <h4 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                          {entry.status}
                          {index === mockTrackingHistory.length - 1 && (order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed') && (
                            <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>
                          )}
                        </h4>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                          {entry.date} - {entry.location}
                        </time>
                      </li>
                    ))}
                  </ol>
                  {order.status?.toLowerCase() !== 'delivered' && order.status?.toLowerCase() !== 'completed' && (
                    <p className="text-gray-600 text-sm mt-4 text-center">
                      Updates will appear here as your order progresses.
                    </p>
                  )}
                </motion.div>
              )}
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
