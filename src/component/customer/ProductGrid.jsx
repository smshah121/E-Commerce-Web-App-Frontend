import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { addToCart } from '../../feature/cart/cartSlice';
import { FiSearch, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';

const ProductGrid = ({ products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [addedItems, setAddedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCart = (product, event) => {
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
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price || 0).toFixed(2);
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Sub-Header Actions Component Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Featured Hardware</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Handpicked premium peripherals and modules.</p>
          </div>

          {/* Centered Luxury Tech Search Bar */}
          <div className="w-full md:max-w-md">
            <div className="relative group">
              <input
                type="text"
                placeholder="Filter dynamic components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-slate-50/50 rounded-xl border border-slate-200/80 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FiSearch className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200/60">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">No elements matched filter</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Verify your syntax or parameters and check alternative categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200/80 transition-all duration-400 flex flex-col cursor-pointer overflow-hidden relative"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Media Presentation Wrapper */}
                <div className="relative w-full h-64 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0].image} 
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">No Module Asset</span>
                    </div>
                  )}

                  {/* Absolute State Badges */}
                  {addedItems.has(product.id) && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center shadow-md shadow-emerald-500/10 z-10 animate-fade-in">
                      <FiCheckCircle className="mr-1 w-3.5 h-3.5" />
                      Synced
                    </div>
                  )}
                  
                  {/* Action Micro-Overlay */}
                  <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Descriptor Metrics block */}
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="font-bold text-base text-slate-900 tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-200 mb-1" title={product.name}>
                    {product.name}
                  </h4>

                  <div className="text-lg font-black text-slate-900 tracking-tight mb-2">
                    ${formatPrice(product.price)}
                  </div>

                  {product.description ? (
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-5 font-medium flex-grow">
                      {product.description}
                    </p>
                  ) : (
                    <div className="flex-grow mb-5" />
                  )}

                  {/* High Performance Add Action Control */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedItems.has(product.id)
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900 text-white hover:bg-blue-600 shadow-sm group-hover:shadow-md'
                    }`}
                  >
                    {addedItems.has(product.id) ? (
                      <>
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Added to Ecosystem</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="w-4 h-4" />
                        <span>Deploy to Cart</span>
                      </>
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