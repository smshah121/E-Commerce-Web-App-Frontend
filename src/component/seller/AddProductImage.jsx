import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddProductImageMutation } from '../../feature/product/productApi';
import { FaCloudUploadAlt, FaTimesCircle, FaCheckCircle, FaSpinner, FaFileAlt } from 'react-icons/fa';

const AddProductImage = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [addImage, { isLoading, isSuccess, isError, error, reset }] = useAddProductImageMutation();

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (droppedFile.type.startsWith('image/')) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(droppedFile));
      } else {
        setPreviewUrl(null);
      }

      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(droppedFile);
        fileInputRef.current.files = dt.files;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericId = Number(productId);
    if (!file || !numericId || isNaN(numericId)) {
      console.error('Invalid productId or no file selected');
      return;
    }

    try {
      await addImage({ productId: numericId, file }).unwrap();
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (isError) {
      reset();
    }
  };

  const isImageFile = file && file.type.startsWith('image/');
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!productId || isNaN(Number(productId))) {
    return <div className="text-red-600 font-semibold">Invalid Product ID</div>;
  }

  return (
   <div className="space-y-4 pt-6 border-t border-neutral-200/80 mt-6">
    <h4 className="text-xs font-bold text-neutral-900 tracking-wider uppercase">Upload Product Media</h4>

    <div
      className={`relative p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
        dragActive
          ? 'border-black bg-neutral-100/80'
          : file
            ? 'border-neutral-900 bg-neutral-50'
            : 'border-neutral-300 bg-neutral-50/50 hover:bg-white hover:border-neutral-400'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        id={`file-input-${productId}`}
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
      />

      {!file ? (
        <motion.label
          htmlFor={`file-input-${productId}`} 
          className="flex flex-col items-center justify-center p-6 cursor-pointer text-neutral-600"
          animate={{ scale: dragActive ? 1.01 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <FaCloudUploadAlt className="text-5xl text-neutral-400 mb-3" />
          <p className="font-semibold text-sm text-neutral-900 tracking-tight">
            {dragActive ? 'Drop image file to attach' : 'Drag & drop product image here'}
          </p>
          <p className="text-xs text-neutral-500 mt-1 font-light">
            or <span className="text-black font-semibold underline underline-offset-2">browse files</span> from your computer
          </p>
          <p className="text-[11px] text-neutral-400 mt-2 tracking-wide font-light">
            Supports: JPG, PNG, WEBP, GIF, PDF
          </p>
        </motion.label>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-3"
        >
          {isImageFile && previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-40 max-h-40 object-contain rounded-xl mb-3 border border-neutral-200 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 mb-3">
              <FaFileAlt className="text-3xl" />
            </div>
          )}
          <p className="font-semibold text-xs text-neutral-900 tracking-tight">{file.name}</p>
          <p className="text-[11px] text-neutral-400 font-light mt-0.5">{formatFileSize(file.size)}</p>
          <button
            onClick={removeFile}
            className="mt-3 text-neutral-500 hover:text-black text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1"
          >
            <FaTimesCircle className="text-sm" />
            <span>Remove Image</span>
          </button>
        </motion.div>
      )}
    </div>

    {/* Upload Submission Button */}
    <AnimatePresence>
      {file && !isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center space-x-4"
        >
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="flex-1 bg-black text-white font-medium text-xs tracking-wider uppercase py-3 px-6 rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            disabled={isLoading || !file}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2 text-sm" />
                Uploading Media...
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="mr-2 text-sm" />
                Upload Selected File
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Feedback Alerts */}
    <AnimatePresence>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-neutral-900 text-white p-3 rounded-xl flex items-center space-x-2 text-xs border border-neutral-800 shadow-sm"
        >
          <FaCheckCircle className="text-emerald-400 text-base" />
          <span className="font-medium tracking-wide">Image uploaded to product listing successfully!</span>
        </motion.div>
      )}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-neutral-900 text-white p-3 rounded-xl flex items-center space-x-2 text-xs border border-neutral-800 shadow-sm"
        >
          <FaTimesCircle className="text-red-400 text-base" />
          <span className="font-medium tracking-wide">Upload failed: {error?.data?.message || 'Unknown error occurred'}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};

export default AddProductImage;
