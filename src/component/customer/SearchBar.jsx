import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, onSearchSubmit }) => {
  const handleSearchClick = (e) => {
    // If a custom function was passed down (like scrolling or filtering explicitly), call it
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    } else {
      // Fallback: Smoothly anchor down to your featured products grid section
      const targetSection = document.getElementById('featured-products');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
      <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/80 transition-all duration-200">
        
        {/* Decorative Magnifying glass Icon */}
        <div className="pl-3 text-slate-400 pointer-events-none flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Core Input Field */}
        <input
          type="text"
          placeholder="Search products, brands, accessories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent py-2.5 text-slate-900 placeholder-slate-400 text-sm font-medium outline-none border-none"
        />

        {/* Premium Action Trigger */}
        <button
          onClick={handleSearchClick}
          className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm shrink-0 hover:-translate-y-0.5 active:translate-y-0"
        >
          Search
        </button>
        
      </div>
    </div>
  );
};

export default SearchBar;