import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCreateProductMutation } from '../../feature/product/productApi';


const CreateProductForm = () => {
  const [createProduct] = useCreateProductMutation();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData).unwrap();
      alert('Product Created');
      setFormData({ name: '', price: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="space-y-2"
        >
          <label className="text-sm font-semibold text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
            required
          />
        </motion.div>
        
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="space-y-2"
        >
          <label className="text-sm font-semibold text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
            required
          />
        </motion.div>
      </div>
      
      <motion.div
        whileFocus={{ scale: 1.02 }}
        className="space-y-2"
      >
        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          placeholder="Enter product description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 resize-none"
          required
        />
      </motion.div>
      
      <motion.button 
        type="submit"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <span className="flex items-center justify-center">
          <motion.svg 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </motion.svg>
          Create Product
        </span>
      </motion.button>
    </motion.form>
  );
};

export default CreateProductForm;