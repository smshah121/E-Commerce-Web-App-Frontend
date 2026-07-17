import  { useState } from "react";
import { useCreateSellerApplicationMutation } from "../../feature/seller-application/sellerApplicationApi"; // Update with your actual import path
import { Link } from "react-router-dom";
const BecomeSeller = () => {
  // 1. Initialize the RTK Query mutation hook
  const [createApplication, { isLoading, isSuccess, isError, error }] =
    useCreateSellerApplicationMutation();

  // 2. Form state mapped exactly to your CreateSellerApplicationDto
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    phone: "",
    address: "",
  });

  // Local client-side validation errors
  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Basic validation matching the DTO constraints
  const validateForm = () => {
    const errors = {};
    if (!formData.storeName.trim()) {
      errors.storeName = "Store name is required.";
    } else if (formData.storeName.length > 100) {
      errors.storeName = "Store name cannot exceed 100 characters.";
    }

    if (!formData.storeDescription.trim()) {
      errors.storeDescription = "Store description is required.";
    } else if (formData.storeDescription.length > 1000) {
      errors.storeDescription = "Description cannot exceed 1000 characters.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (formData.phone.length > 20) {
      errors.phone = "Phone number cannot exceed 20 characters.";
    }

    if (!formData.address.trim()) {
      errors.address = "Business address is required.";
    } else if (formData.address.length > 255) {
      errors.address = "Address cannot exceed 255 characters.";
    }

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // 3. Trigger the mutation with the DTO payload
      await createApplication(formData).unwrap();
    } catch (err) {
      console.error("Failed to submit application:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        
        <div classname="absolute top-6 left-6">
            <Link 
            to="/customer-dashboard"
             className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-200"
            
            >
                <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard


            </Link>

            
         </div>   

        {isSuccess && (
        <div className="absolute top-6 left-6">
          <Link
            to="/customer-dashboard"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-200"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Become a Seller</h2>
      <p className="text-gray-600 mb-6">
        Submit your business details below. Our team will review your application and get back to you shortly.
      </p>

      {/* Success State */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          <p className="font-semibold">Application Submitted Successfully!</p>
          <p className="text-sm mt-1">
            We have received your application. Once our admins approve it, you'll be granted seller dashboard access.
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-semibold">Submission Failed</p>
          <p className="text-sm mt-1">
            {error?.data?.message || "Something went wrong. Please check your inputs and try again."}
          </p>
        </div>
      )}

      {/* Form */}
      {!isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              maxLength={100}
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                localErrors.storeName ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. Retro Corner Shop"
            />
            {localErrors.storeName && (
              <p className="text-red-500 text-xs mt-1">{localErrors.storeName}</p>
            )}
            <span className="text-gray-400 text-xs block text-right mt-1">
              {formData.storeName.length}/100
            </span>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={20}
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                localErrors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. +1 555-0199"
            />
            {localErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{localErrors.phone}</p>
            )}
          </div>

          {/* Business Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              maxLength={255}
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                localErrors.address ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. 123 Main St, Suite 4B, New York, NY"
            />
            {localErrors.address && (
              <p className="text-red-500 text-xs mt-1">{localErrors.address}</p>
            )}
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                localErrors.storeDescription ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="Tell us about the products you plan to sell and your business..."
            />
            {localErrors.storeDescription && (
              <p className="text-red-500 text-xs mt-1">{localErrors.storeDescription}</p>
            )}
            <span className="text-gray-400 text-xs block text-right mt-1">
              {formData.storeDescription.length}/1000
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md transition duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {isLoading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BecomeSeller;