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
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-5"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <motion.div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase">Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Wireless Noise-Canceling Headphones"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3.5 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
          required
        />
      </motion.div>
      
      <motion.div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase">Price ($)</label>
        <input
          type="number"
          name="price"
          placeholder="0.00"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="w-full p-3.5 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
          required
        />
      </motion.div>
    </div>
    
    <motion.div className="space-y-1.5">
      <label className="text-xs font-semibold text-neutral-700 tracking-wide uppercase">Description</label>
      <textarea
        name="description"
        placeholder="Provide key features, specs, and details about the item..."
        value={formData.description}
        onChange={handleChange}
        rows="4"
        className="w-full p-3.5 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 resize-none font-light leading-relaxed"
        required
      />
    </motion.div>
    
    <motion.button 
      type="submit"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center border border-black"
    >
      <span className="flex items-center justify-center">
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Product Listing
      </span>
    </motion.button>
  </motion.form>
  );
};

export default CreateProductForm;