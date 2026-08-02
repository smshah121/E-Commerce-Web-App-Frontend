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
  const [priceFilter, setPriceFilter] = useState('default');
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

  const filteredProducts = products
  ?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  ?.sort((a, b) => {
    if (priceFilter === 'low-high') {
      return Number(a.price) - Number(b.price);
    }

    if (priceFilter === 'high-low') {
      return Number(b.price) - Number(a.price);
    }

    return 0;
  });

  return (
   <section className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
  {/* Header */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-neutral-200">
      {/* Search & Sort */}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative group flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-colors duration-300 group-focus-within:text-black" />

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 text-sm text-neutral-900 placeholder-neutral-400 bg-white border border-neutral-200 rounded-xl outline-none transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black shadow-sm"
          />
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-[220px]">
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full px-4 py-3.5 text-sm font-medium text-neutral-800 bg-white border border-neutral-200 rounded-xl outline-none cursor-pointer transition-all duration-300 focus:border-black focus:ring-1 focus:ring-black shadow-sm"
          >
            <option value="default">Sort by: Recommended</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  {/* Products Section */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
    {!filteredProducts || filteredProducts.length === 0 ? (
      <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-neutral-300 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-5 bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200">
          <FiSearch className="w-7 h-7 text-neutral-400" />
        </div>

        <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
          No products found
        </h3>

        <p className="text-sm text-neutral-500 mt-2 font-light">
          Try searching with a different product name.
        </p>

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="mt-5 text-sm font-semibold text-neutral-900 underline hover:text-neutral-600 transition-colors"
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
              className="group relative bg-white rounded-2xl border border-neutral-200/90 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-neutral-100 overflow-hidden">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg==';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                    <FiShoppingCart className="w-10 h-10 mb-3 opacity-60" />
                    <span className="text-xs font-medium tracking-wide">
                      Image unavailable
                    </span>
                  </div>
                )}

                {/* Subtle Image Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Added Badge */}
                {isAdded && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-neutral-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Added
                  </div>
                )}

                {/* View Product Button Overlay */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-full py-2.5 bg-black/90 backdrop-blur-sm rounded-xl text-center text-xs font-medium text-white shadow-lg tracking-wide border border-neutral-800">
                    View Product
                  </div>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5 flex flex-col h-[200px]">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="font-bold text-base text-neutral-900 line-clamp-2 leading-snug group-hover:text-black transition-colors duration-300"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <span className="shrink-0 text-lg font-bold text-neutral-900">
                    ${formatPrice(product.price)}
                  </span>
                </div>

                {/* Store / Seller */}
                <p className="text-xs mt-2 font-medium tracking-wider text-neutral-400 uppercase">
                  {product.seller?.sellerApplication?.storeName || 'PriceTag'}
                </p>

                {product.description && (
                  <p className="mt-2 text-xs text-neutral-500 line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>
                )}

                {/* Add to Cart Button */}
                <div className="mt-auto">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`mt-4 w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 tracking-wide ${
                      isAdded
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-black text-white hover:bg-neutral-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <FiCheckCircle className="w-4 h-4 text-emerald-400" />
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