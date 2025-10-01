// AddToCart.jsx - This component is for displaying CART ITEMS, not products
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../feature/cart/cartSlice';
import PlaceOrderButton from '../admin/PlaceOrderButoon';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => getDashboardPath()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </button>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <span className="text-white text-xl">🛒</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mb-6">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h3>
              <p className="text-gray-600 mb-6">Add some amazing products to get started!</p>
              <button 
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({totalQuantity})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {item.images?.length > 0 ? (
                            <div className="flex gap-2">
                              {item.images.slice(0, 2).map(img =>
                                img.images.slice(0, 1).map((path, idx) => {
                                  const fullPath = `${API_URL}${path}`;

                                  return (
                                    <img
                                      key={`${img.id}-${idx}`}
                                      src={fullPath}
                                      alt={`${item.name} preview`}
                                      className="w-20 h-20 object-cover border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                      onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMjggMjRIMzZWNDBIMjhWMjRaIiBmaWxsPSIjOUNBM0FGIi8+PHBhdGggZD0iTTI0IDI4SDQwVjMySDI0VjI4WiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==';
                                      }}
                                    />
                                  );
                                })
                              )}
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg">
                              <span className="text-2xl">📦</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div className="mb-2 sm:mb-0">
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                              <p className="text-blue-600 font-medium">${item.price.toFixed(2)} each</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-200 text-sm font-medium self-start"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Quantity Controls and Total */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center mb-3 sm:mb-0">
                              <span className="text-sm text-gray-600 mr-3">Quantity:</span>
                              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                                >
                                  −
                                </button>
                                <span className="px-4 py-2 bg-white border-x border-gray-200 text-gray-900 font-semibold min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Subtotal</p>
                              <p className="text-xl font-bold text-gray-900">
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
              <div className="sticky top-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Summary Items */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Items ({totalQuantity})</span>
                        <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium text-gray-900">Calculated at checkout</span>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                     <button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium'
                     onClick={()=> navigate("/checkout")}
                     >Checkout</button>
                      <button 
                        onClick={() => window.history.back()}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium"
                      >
                        Continue Shopping
                      </button>
                    </div>

                    {/* Security Badge */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <span className="mr-2">🔒</span>
                        Secure Checkout
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promotional Banner */}
                <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm text-white p-6 text-center">
                  <h4 className="font-semibold mb-2">🎉 Free Shipping!</h4>
                  <p className="text-sm opacity-90">
                    Enjoy free shipping on all orders. No minimum required!
                  </p>
                </div>

                {/* Customer Service */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">💬</span>
                    Need Help?
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
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