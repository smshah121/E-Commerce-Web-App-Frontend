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
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-gray-800">Upload Product Image</h4>

      <div
        className={`relative p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-white'
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
            htmlFor="file-input"
            className="flex flex-col items-center justify-center p-8 cursor-pointer text-gray-600"
            animate={{ scale: dragActive ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaCloudUploadAlt className="text-6xl text-gray-400 mb-4" />
            <p className="font-semibold text-lg">
              {dragActive ? 'Drop your file here' : 'Drag & drop a file here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or <span className="text-blue-500 underline">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports: PDF, JPG, PNG, GIF, WebP
            </p>
          </motion.label>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-4"
          >
            {isImageFile && previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-48 max-h-48 object-contain rounded-lg mb-4 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                <FaFileAlt className="text-4xl" />
              </div>
            )}
            <p className="font-semibold text-center">{file.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            <button
              onClick={removeFile}
              className="mt-3 text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
            >
              <FaTimesCircle />
              <span>Remove file</span>
            </button>
          </motion.div>
        )}
      </div>

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
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !file}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="mr-2" />
                  Upload File
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-green-100 text-green-700 p-3 rounded-lg flex items-center space-x-2 text-sm"
          >
            <FaCheckCircle className="text-xl" />
            <span>File uploaded successfully!</span>
          </motion.div>
        )}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center space-x-2 text-sm"
          >
            <FaTimesCircle className="text-xl" />
            <span>Error uploading file: {error?.data?.message || 'Unknown error occurred'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProductImage;
