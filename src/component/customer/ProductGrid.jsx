import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addToCart } from '../../feature/cart/cartSlice';

const ProductGrid = ({ products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [addedItems, setAddedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");


  const handleAddToCart = (product, event) => {
    // Stop event propagation to prevent navigating to product detail when clicking "Add to Cart"
    event.stopPropagation();
    dispatch(addToCart(product));
    setAddedItems(prev => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const handleProductClick = (productId) => {
    // Navigate to the product detail page when the card is clicked
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);
  };

  // Filter logic
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Premium quality, unbeatable prices
          </p>

          {/* Centered Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 placeholder-gray-500 bg-white rounded-2xl shadow-2xl border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Handpicked items just for you</p>
        </div>

        {/* Products Grid or No Results */}
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 cursor-pointer flex flex-col" // Added flex flex-col here
                onClick={() => handleProductClick(product.id)}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden w-full h-64 flex items-center justify-center bg-gray-100"> {/* Fixed height, flex for centering, fallback bg */}
                  {product.images?.[0]?.images?.[0] ? (
                    <img
                      src={`${API_URL}${product.images[0].images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" // Changed object-cover to object-contain, slightly reduced hover scale
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zz4KPHJlY3Qgd2lkdGg9IjMwMC alturasPSIzMDAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTE1MCAxMDBDMTI3LjkgMTAwIDExMCAxMTcuOSAxMTAgMTQwUzEyNy45IDE4MCAxNTAgMTgwUzE5MCAxNjIuMSAxOTAgMTQwUzE3Mi4xIDEwMCAxNTAgMTAwTTE1MCAxMTVTMTY0LjMgMTE1IDE3NSAxNDMuMSAxNzUgMTU3UzE2NC4zIDE2NSAxNTAgMjAwUzEyNSAxNjUuMSAxMjUgMTU3UzEzNS43IDExNSAxNTAgMTE1WiIgZmlsbD0iIzlCOTlCRTAiLz4KPC9zdmc+';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-500 text-sm font-medium">No Image Available</span>
                      </div>
                    </div>
                  )}

                  {/* Success Badge */}
                  {addedItems.has(product.id) && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
                      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Added!
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
                  <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${formatPrice(product.price)}
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-500 text-sm ml-1">(4.8)</span>
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow"> {/* Increased line-clamp to 3, added flex-grow */}
                      {product.description}
                    </p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`mt-auto w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${ // Added mt-auto
                      addedItems.has(product.id)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-200 hover:shadow-xl'
                    }`}
                  >
                    {addedItems.has(product.id) ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Added to Cart
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        Add to Cart
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;