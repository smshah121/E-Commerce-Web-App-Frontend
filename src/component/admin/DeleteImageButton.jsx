import React from 'react';
import { useDeleteProductImageMutation } from '../../feature/product/productApi';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react'; 

const DeleteImageButton = ({ imageId }) => {
  const [deleteImage, { isLoading }] = useDeleteProductImageMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId).unwrap();
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('Error deleting image');
      }
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleDelete}
      disabled={isLoading}
      title="Delete Image"
      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </motion.button>
  );
};

export default DeleteImageButton;
