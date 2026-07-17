import { useState } from "react";
import { useCreateSellerApplicationMutation } from "../../feature/seller-application/sellerApplicationApi"; 
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
      await createApplication(formData).unwrap();
    } catch (err) {
      console.error("Failed to submit application:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center antialiased selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-100 shadow-xl p-8 relative overflow-hidden">
        
        {/* Navigation Context Action */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/customer-dashboard"
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 mr-2 transform transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
          
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Merchant Access
          </span>
        </div>   

        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Become a Seller
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Submit your business metrics below. Our system administration team will review your ecosystem profile details within 24 hours.
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex gap-3">
            <span className="text-xl">✨</span>
            <div>
              <p className="font-bold text-sm">Application Filed Successfully</p>
              <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
                We have logged your merchant registry details. Once approved, your account token will grant dashboard access automatically.
              </p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {isError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">Submission Error Detected</p>
              <p className="text-xs text-rose-600 mt-0.5 leading-relaxed">
                {error?.data?.message || "Verify your parameters and processing payload metrics."}
              </p>
            </div>
          </div>
        )}

        {/* Form Loop */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                maxLength={100}
                className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none ${
                  localErrors.storeName 
                    ? "border-rose-300 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500" 
                    : "border-slate-200/80 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                }`}
                placeholder="e.g. PriceTag Accessories Hub"
              />
              <div className="flex justify-between items-center text-[11px] font-medium pt-0.5">
                <span>
                  {localErrors.storeName && <p className="text-rose-500">{localErrors.storeName}</p>}
                </span>
                <span className="text-slate-400 font-mono tracking-tighter">
                  {formData.storeName.length}/100
                </span>
              </div>
            </div>

            {/* Phone & Address Grid Pair */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  Contact Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none ${
                    localErrors.phone 
                      ? "border-rose-300 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500" 
                      : "border-slate-200/80 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                  placeholder="e.g. +1 555-0199"
                />
                {localErrors.phone && <p className="text-rose-500 text-[11px] font-medium">{localErrors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                  Business Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  maxLength={255}
                  className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none ${
                    localErrors.address 
                      ? "border-rose-300 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500" 
                      : "border-slate-200/80 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                  }`}
                  placeholder="e.g. 123 Core St, New York"
                />
                {localErrors.address && <p className="text-rose-500 text-[11px] font-medium">{localErrors.address}</p>}
              </div>
            </div>

            {/* Store Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                Store Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none resize-none ${
                  localErrors.storeDescription 
                    ? "border-rose-300 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500" 
                    : "border-slate-200/80 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                }`}
                placeholder="Outline what core mobile components or audio assets you intend to list..."
              />
              <div className="flex justify-between items-center text-[11px] font-medium pt-0.5">
                <span>
                  {localErrors.storeDescription && <p className="text-rose-500">{localErrors.storeDescription}</p>}
                </span>
                <span className="text-slate-400 font-mono tracking-tighter">
                  {formData.storeDescription.length}/1000
                </span>
              </div>
            </div>

            {/* Action Form Submission Trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? "Processing Application Registry..." : "Submit Verification Packet"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BecomeSeller;