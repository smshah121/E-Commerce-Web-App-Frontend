import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa"; // Changed icon for address
import { useDispatch } from 'react-redux';
import CustomerNavbar from './NavbarCust';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { clearCart } from '../../feature/cart/cartSlice';
import { useCreatePaymentMutation } from '../../feature/payment/paymentApi';
import { useCreateOrderMutation } from '../../feature/order/orderApi';



const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { token, userId } = useSelector((state) => state.auth); // Get userId from auth state
  const isLoggedIn = Boolean(token);
  const [createPayment, { isLoading }] = useCreatePaymentMutation();



  const [createOrder]=useCreateOrderMutation()
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false); // Renamed from processingPayment
  const [orderError, setOrderError] = useState(null); // Renamed from paymentError


  // State for address fields
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

   const handlePayOnline = async () => {
  if (
    !address.street ||
    !address.city ||
    !address.state ||
    !address.postalCode ||
    !address.country
  ) {
    alert("Fill all address fields");
    return;
  }

  try {
    // Step 1: Create Order
    const order = await createOrder({
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),

      subtotal,
      shipping,
      tax,
      total,

      address,

      paymentMethod: "ONLINE", // ✅ Important
    }).unwrap();

    // Step 2: Create Stripe Checkout Session
    const res = await createPayment({
      orderId: order.id,
    }).unwrap();

    // Step 3: Redirect to Stripe
    if (res.url) {
      window.location.href = res.url;
    } else {
      alert("Payment session not created.");
    }
  } catch (err) {
    console.error(err);
    alert("Payment initiation failed.");
  }
};
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
      await createOrder({
    items: cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    })),

    subtotal,
    shipping,
    tax,
    total,

    address,

    paymentMethod: "COD",
  }).unwrap();

  setOrderPlaced(true);
  dispatch(clearCart());

    } catch (err) {
  setOrderError(err?.data?.message || "Failed to place order.");
} finally {
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
  <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
  <CustomerNavbar />
  <main className="pt-16 pb-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-neutral-600 hover:text-black transition-colors font-medium text-sm tracking-wide"
        whileHover={{ x: -4 }}
      >
        <FaArrowLeft className="mr-2 text-xs" /> Back to Cart
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-5 md:p-7"
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-1 text-center tracking-tight">Checkout</h1>
        <p className="text-neutral-500 text-xs text-center mb-6 font-light">Complete your details and finalize your order</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Order Summary & Pricing */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 mb-3 tracking-wide uppercase text-xs">Order Summary</h2>
              <div className="border border-neutral-200/80 rounded-xl p-3.5 bg-neutral-50/50 max-h-52 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4 text-xs font-light">Your cart is empty.</p>
                ) : (
                  <ul className="divide-y divide-neutral-200/60">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              item.images?.[0]?.image ||
                              item.product?.images?.[0]?.image ||
                              `https://placehold.co/80x80/F5F5F5/171717?text=${encodeURIComponent(item.name)}`
                            }
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-neutral-200 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-neutral-900 text-xs line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900 text-xs">${formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-2 text-sm bg-neutral-100/60 p-3.5 rounded-xl border border-neutral-200/80">
              <div className="flex justify-between text-neutral-600 text-xs font-light">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">${formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 text-xs font-light">
                <span>Shipping</span>
                <span className="font-semibold text-neutral-900">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base text-neutral-900 border-t border-neutral-200/80 pt-2 mt-2 tracking-tight">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Address */}
          <div>
            <h2 className="text-base font-bold text-neutral-900 mb-3 flex items-center tracking-wide uppercase text-xs">
              <FaMapMarkerAlt className="mr-2 text-neutral-700" /> Delivery Address
            </h2>
            <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/80 space-y-3">
              <div>
                <label htmlFor="street" className="block text-xs font-medium text-neutral-700 mb-1">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="Anytown"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-neutral-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="CA"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="postalCode" className="block text-xs font-medium text-neutral-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="90210"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs font-medium text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 text-xs text-neutral-900 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="USA"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {orderError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-xl relative mt-4 text-xs"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {orderError}</span>
          </motion.div>
        )}

        {/* Place Order Section */}
        <div className="border-t border-neutral-200/80 pt-5 mt-5">
          <h2 className="text-sm font-bold text-neutral-900 text-center mb-0.5 tracking-tight">
            Select Payment Method
          </h2>
          <p className="text-neutral-500 text-xs text-center mb-4 font-light">
            Choose how you'd like to pay for your order.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cash on Delivery Button */}
            <motion.button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || processingOrder}
              className="bg-white text-neutral-900 border-2 border-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-all duration-300 flex items-center justify-center disabled:opacity-50 tracking-wide"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {processingOrder ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <AiOutlineShoppingCart className="mr-2 text-base" />
                  Cash on Delivery
                </>
              )}
            </motion.button>

            {/* Online Payment Button */}
            <motion.button
              onClick={handlePayOnline}
              disabled={cartItems.length === 0 || isLoading}
              className="bg-black text-white border border-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 shadow-sm tracking-wide"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Redirecting...
                </>
              ) : (
                <>
                  💳 Pay Online
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  </main>
</div>
  );
};

export default CheckoutPage;
