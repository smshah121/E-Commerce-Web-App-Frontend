// components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center w-full max-w-xl mx-auto mt-6">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow p-2 rounded-l-md shadow-sm outline-none"
      />
      <button className="px-4 py-2 bg-blue-600 ml-3 text-white rounded-r-md hover:bg-blue-700">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
