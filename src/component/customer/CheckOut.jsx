import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import CustomerNavbar from './NavbarCust';
import { AiOutlineShoppingCart } from "react-icons/ai";

import { clearCart } from '../../feature/cart/cartSlice';
import { useCreatePaymentMutation } from '../../feature/payment/paymentApi';
import { useCreateOrderMutation } from '../../feature/order/orderApi';



const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const cartItems = useSelector((state) => state.cart.items);
  const { token, userId } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(token);

  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const [createOrder] = useCreateOrderMutation();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // ✅ Address state (FIXED POSITION)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // Redirect guard
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (cartItems.length === 0 && !orderPlaced) {
      navigate('/customer-dashboard');
    }
  }, [isLoggedIn, cartItems, navigate, orderPlaced]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0;
  const tax = 0;
  const total = subtotal;

  const formatPrice = (price) =>
    typeof price === 'number'
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);

  const handleAddressChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // COD ORDER
  // =========================
  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    setOrderError(null);

    if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      setOrderError("Please fill all address fields.");
      setProcessingOrder(false);
      return;
    }

    try {
      const order = await createOrder({
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        tax,
        total,
        address,
        customerId: userId,
        orderedAt: new Date().toISOString(),
        status: 'pending',
      }).unwrap();

      setOrderPlaced(true);
      dispatch(clearCart());
      setProcessingOrder(false);

      console.log("COD Order Created:", order);

    } catch (err) {
      setOrderError(err?.data?.message || "Order failed");
      setProcessingOrder(false);
    }
  };

  // =========================
  // ONLINE PAYMENT
  // =========================
  const handlePayOnline = async () => {
    if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      alert("Fill all address fields");
      return;
    }

    try {
      const order = await createOrder({
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        tax,
        total,
        address,
        customerId: userId,
      }).unwrap();

      const orderId = order?.id || order?._id;

      const res = await createPayment({
        orderId,
      }).unwrap();

      if (res?.url) {
        window.location.href = res.url;
      } else {
        alert("Payment session not created");
      }

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  // =========================
  // SUCCESS SCREEN
  // =========================
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="mb-4">Your order has been placed successfully.</p>

          <button
            onClick={() => navigate('/my-orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="max-w-4xl mx-auto p-6 pt-24">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white p-6 rounded-xl shadow">

          <h1 className="text-2xl font-bold mb-6 text-center">
            Checkout
          </h1>

          {/* ORDER SUMMARY */}
          <div className="mb-6">
            {cartItems.map((item) => {
              const imagePath = item.images?.[0]?.images?.[0];

              return (
                <div key={item.id} className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        imagePath
                          ? `${API_URL}${imagePath}`
                          : `https://placehold.co/80x80`
                      }
                      className="w-14 h-14 rounded"
                    />
                    <div>
                      <p>{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <p>${formatPrice(item.price * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          {/* ADDRESS */}
          <div className="mb-6">
            <h2 className="flex items-center text-lg font-semibold mb-3">
              <FaMapMarkerAlt className="mr-2" /> Delivery Address
            </h2>

            <div className="grid gap-3">
              <input name="street" placeholder="Street" onChange={handleAddressChange} className="input" />
              <input name="city" placeholder="City" onChange={handleAddressChange} className="input" />
              <input name="state" placeholder="State" onChange={handleAddressChange} className="input" />
              <input name="postalCode" placeholder="Postal Code" onChange={handleAddressChange} className="input" />
              <input name="country" placeholder="Country" onChange={handleAddressChange} className="input" />
            </div>
          </div>

          {orderError && (
            <p className="text-red-500 mb-4">{orderError}</p>
          )}

          {/* COD BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={processingOrder}
            className="w-full bg-green-600 text-white py-3 rounded-lg mb-3"
          >
            {processingOrder ? "Placing Order..." : "Place Order (COD)"}
          </button>

          {/* ONLINE BUTTON */}
          <button
            onClick={handlePayOnline}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isLoading ? "Processing..." : "Pay Online"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;