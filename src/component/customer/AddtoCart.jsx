// AddToCart.jsx - This component is for displaying CART ITEMS, not products
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../feature/cart/cartSlice';
import PlaceOrderButton from '../seller/PlaceOrderButoon';
import { useNavigate } from 'react-router-dom';

const AddToCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { items: cart, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const getDashboardPath = ()=> {
    navigate("/customer-dashboard")
  }

  const handleUpdateQuantity = (id, change) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        dispatch(removeFromCart(id));
      } else {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      }
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
    {/* Back Button */}
    <div className="mb-8">
      <button
        onClick={() => getDashboardPath()}
        className="inline-flex items-center text-neutral-600 hover:text-black font-medium transition-colors duration-200 text-sm tracking-wide"
      >
        <span className="mr-2">←</span>
        Back to Dashboard
      </button>
    </div>

    {/* Header */}
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <div className="bg-black p-2.5 rounded-xl shadow-sm">
          <span className="text-white text-xl">🛒</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Shopping Cart</h1>
      </div>
      <p className="text-neutral-500 font-light">Review your items and proceed to checkout</p>
    </div>

    {cart.length === 0 ? (
      /* Empty Cart State */
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-12 text-center">
        <div className="mb-6">
          <div className="bg-neutral-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
            <span className="text-4xl text-neutral-400">🛒</span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">Your Cart is Empty</h3>
          <p className="text-neutral-500 font-light mb-6">Add some amazing products to get started!</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-black text-white px-8 py-3.5 rounded-xl font-medium hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg tracking-wide text-sm"
          >
            Start Shopping
          </button>
        </div>
      </div>
    ) : (
      /* Cart Content */
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
            <div className="bg-neutral-100/70 px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                Cart Items ({totalQuantity})
              </h2>
            </div>
            
            <div className="divide-y divide-neutral-200/70">
              {cart.map(item => (
                <div key={item.id} className="p-6 hover:bg-neutral-50/80 transition-colors duration-200">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {item.images?.length > 0 ? (
                        <div className="flex gap-2">
                          {item.images.slice(0, 2).map((imgObj, idx) => (
                            <img
                              key={imgObj.id || idx}
                              src={imgObj.image}
                              alt={`${item.name} preview`}
                              className="w-20 h-20 object-cover border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-neutral-100 border border-neutral-200 flex items-center justify-center rounded-xl">
                          <span className="text-2xl text-neutral-400">📦</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div className="mb-2 sm:mb-0">
                          <h3 className="font-bold text-lg text-neutral-900 mb-0.5 tracking-tight">{item.name}</h3>
                          <p className="text-neutral-500 font-medium text-sm">${item.price.toFixed(2)} each</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 hover:bg-neutral-100 px-3 py-1 rounded-lg transition-all duration-200 text-xs font-semibold uppercase tracking-wider self-start"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Quantity Controls and Total */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider mr-3">Quantity:</span>
                          <div className="flex items-center bg-neutral-100 border border-neutral-200/80 rounded-xl overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="px-3.5 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-200/60 transition-all duration-200 font-bold text-sm"
                            >
                              −
                            </button>
                            <span className="px-4 py-1.5 bg-white border-x border-neutral-200/80 text-neutral-900 font-semibold min-w-[2.5rem] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="px-3.5 py-1.5 text-neutral-600 hover:text-black hover:bg-neutral-200/60 transition-all duration-200 font-bold text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Subtotal</p>
                          <p className="text-xl font-bold text-neutral-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
              <div className="bg-neutral-100/70 px-6 py-4 border-b border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Order Summary</h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Summary Items */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-light">Items ({totalQuantity})</span>
                    <span className="font-semibold text-neutral-900">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-light">Shipping</span>
                    <span className="font-semibold text-neutral-900">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-light">Tax</span>
                    <span className="font-medium text-neutral-400 text-xs">Calculated at checkout</span>
                  </div>
                </div>

                <hr className="border-neutral-200" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-neutral-900 tracking-tight">Total</span>
                  <span className="text-2xl font-extrabold text-neutral-900">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button 
                    className="w-full bg-black text-white py-3.5 px-6 rounded-xl hover:bg-neutral-800 transition-all duration-300 font-medium tracking-wide text-sm shadow-md hover:shadow-lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </button>
                  <button 
                    onClick={() => window.history.back()}
                    className="w-full bg-neutral-100 text-neutral-800 py-3.5 px-6 rounded-xl hover:bg-neutral-200 border border-neutral-200/80 transition-all duration-300 font-medium tracking-wide text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Security Badge */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-center text-xs font-medium text-neutral-500 tracking-wide uppercase">
                    <span className="mr-2">🔒</span>
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Banner */}
            <div className="bg-black rounded-2xl shadow-sm text-white p-6 text-center border border-neutral-800">
              <h4 className="font-bold mb-1 tracking-tight text-base">🎉 Free Shipping!</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Enjoy free shipping on all orders. No minimum required!
              </p>
            </div>

            {/* Customer Service */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-6">
              <h4 className="font-bold text-neutral-900 mb-3 flex items-center text-sm tracking-wide">
                <span className="mr-2">💬</span>
                Need Help?
              </h4>
              <div className="space-y-2 text-xs text-neutral-500 font-light">
                <p>• Chat with our support team</p>
                <p>• Call us: 1-800-MYSHOP</p>
                <p>• Email: help@myshop.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
};

export default AddToCart;