import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa"; // Changed icon for address
import { useDispatch } from 'react-redux';
import CustomerNavbar from './NavbarCust';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { clearCart } from '../../feature/cart/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { token, userId } = useSelector((state) => state.auth); // Get userId from auth state
  const isLoggedIn = Boolean(token);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false); // Renamed from processingPayment
  const [orderError, setOrderError] = useState(null); // Renamed from paymentError
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  // State for address fields
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (cartItems.length === 0 && !orderPlaced) {
      navigate('/customer-dashboard'); // Or back to cart page
    }
  }, [isLoggedIn, cartItems, navigate, orderPlaced]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0.00; // Always free delivery
  const tax = 0.00; // No tax as requested
  const total = subtotal + shipping + tax; // Total is now just subtotal + free shipping

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    setOrderError(null);

    // Basic validation for address fields
    if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      setOrderError('Please fill in all address fields.');
      setProcessingOrder(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders`, { // Assuming your orders endpoint is /orders
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
           items: cartItems.map(item => ({ // Map cart items to a simplified structure for the backend
             productId: item.id, // Assuming 'id' is productId
             name: item.name,
             price: item.price,
             quantity: item.quantity,
             images: item.images // Pass images if needed by backend
           })),
           subtotal,
           shipping,
           tax, // This will be 0.00
           total,
           address, // Send the address object directly
           customerId: userId, // Changed from userId to customerId to match backend entity/DTO
           orderedAt: new Date().toISOString(), // Add order timestamp
           status: 'pending' // Initial status
        })
      });
      const result = await response.json();

      if (response.ok) {
        setOrderPlaced(true);
        dispatch(clearCart()); // Clear cart after successful order placement
        setProcessingOrder(false);
        // You might navigate to an order confirmation page here
        // navigate('/order-confirmation', { state: { orderId: result.id } }); // Use result.id for the new order ID
      } else {
        throw new Error(result.message || 'Failed to place order.');
      }

    } catch (err) {
      setOrderError(err.message || 'Order placement failed. Please try again.');
      setProcessingOrder(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Or a loading spinner while redirecting
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-green-500 text-6xl mb-6 mx-auto"
          >
            <FaCheckCircle />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-700 text-lg mb-6">Thank you for your purchase. Your Cash on Delivery order has been confirmed and will be processed shortly.</p>
          <motion.button
            onClick={() => navigate('/my-orders')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Orders
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            whileHover={{ x: -5 }}
          >
            <FaArrowLeft className="mr-2" /> Back to Cart
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-10"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout (Cash on Delivery)</h1>

            {/* Order Summary */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <img
                          src={item.images?.[0]?.images?.[0] ? `http://localhost:3000${item.images[0].images[0]}` : `https://placehold.co/80x80/E0E7FF/3B82F6?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4 shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800">${formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Price Details */}
            <div className="space-y-3 text-lg mb-8">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                {/* Always display "Free" for shipping */}
                <span className="font-semibold text-green-600">Free</span>
              </div>
              {/* Removed Tax line */}
              <div className="flex justify-between font-bold text-xl text-gray-900 border-t border-gray-200 pt-3 mt-3">
                <span>Total:</span>
                <span>${formatPrice(total)}</span>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-blue-600" /> Delivery Address
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Anytown"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="CA"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="90210"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="USA"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {orderError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {orderError}</span>
              </motion.div>
            )}

            {/* Place Order Button */}
            <motion.button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || processingOrder}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {processingOrder ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Placing Order...
                </>
              ) : (
                <>
                  <AiOutlineShoppingCart className="mr-3 text-2xl" /> Place Order (Cash on Delivery)
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
