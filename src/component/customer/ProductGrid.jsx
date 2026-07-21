import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../feature/cart/cartSlice';
import {
  FiSearch,
  FiShoppingCart,
  FiCheckCircle,
  FiArrowRight,
  FiSliders,
} from 'react-icons/fi';

const ProductGrid = ({ products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addedItems, setAddedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCart = (product, event) => {
    event.stopPropagation();

    dispatch(addToCart(product));

    setAddedItems((prev) => new Set([...prev, product.id]));

    setTimeout(() => {
      setAddedItems((prev) => {
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
    return typeof price === 'number'
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Section Heading */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Marketplace
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Featured Products
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-lg">
              Discover premium tech accessories from trusted sellers.
            </p>
          </div>

          {/* Search */}
          <div className="w-full lg:w-[380px]">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-600" />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* Results / Filter Row */}
        <div className="flex items-center justify-between pt-6">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-bold text-slate-900">
              {filteredProducts?.length || 0}
            </span>{' '}
            products
          </p>

          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <FiSliders className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 mx-auto mb-5 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
              <FiSearch className="w-7 h-7 text-slate-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              No products found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Try searching with a different product name.
            </p>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-5 text-sm font-bold text-blue-600 hover:text-purple-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedItems.has(product.id);

              return (
                <article
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-slate-50 overflow-hidden">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0].image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <FiShoppingCart className="w-10 h-10 mb-3" />
                        <span className="text-xs font-semibold">
                          Image unavailable
                        </span>
                      </div>
                    )}

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Added Badge */}
                    {isAdded && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        Added
                      </div>
                    )}

                    {/* View Product */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-full py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-center text-xs font-bold text-slate-900 shadow-lg">
                        View Product
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-5  flex flex-col h-[250px]">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-[#6a25eb] transition-colors duration-300"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <span className="shrink-0 text-lg font-black text-slate-950">
                        ${formatPrice(product.price)}
                      </span>
                    </div>

                    {product.description && (
                      <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`mt-5 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                        isAdded
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-950 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <FiShoppingCart className="w-4 h-4" />
                          Add to Cart
                          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    </div>
                    {/* Add to Cart */}
                    
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;