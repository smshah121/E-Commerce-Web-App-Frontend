import { useState } from "react";
import { useCreateSellerApplicationMutation } from "../../feature/seller-application/sellerApplicationApi"; 
import { Link } from "react-router-dom";
import CustomerNavbar from "./NavbarCust";

const BecomeSeller = () => {
  const [createApplication, { isLoading, isSuccess, isError, error }] =
    useCreateSellerApplicationMutation();

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    phone: "",
    address: "",
  });

  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
      {/* Integrated Customer Navbar */}
      <CustomerNavbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          
          {/* Header Action Row */}
          <div className="mb-6 flex items-center justify-between">
            <Link 
              to="/customer-dashboard"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors duration-200 group"
            >
              <svg
                className="w-3.5 h-3.5 mr-2 transform transition-transform duration-200 group-hover:-translate-x-1"
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
            
            <span className="text-[11px] font-semibold text-neutral-900 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Merchant Access
            </span>
          </div>   

          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              Become a Seller
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-light leading-relaxed">
              Submit your storefront information below. Our management team reviews all merchant registry requests within 24 hours.
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-neutral-900 border border-neutral-800 text-white rounded-xl flex gap-3 shadow-sm">
              <span className="text-lg">✓</span>
              <div>
                <p className="font-bold text-xs uppercase tracking-wide">Application Filed Successfully</p>
                <p className="text-xs text-neutral-400 mt-0.5 font-light leading-relaxed">
                  We have logged your merchant details. Once verified by our administrators, your seller dashboard permissions will unlock automatically.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {isError && (
            <div className="mb-6 p-4 bg-neutral-900 border border-neutral-800 text-white rounded-xl flex gap-3 shadow-sm">
              <span className="text-lg text-neutral-400">⚠️</span>
              <div>
                <p className="font-bold text-xs uppercase tracking-wide">Submission Error Detected</p>
                <p className="text-xs text-neutral-400 mt-0.5 font-light leading-relaxed">
                  {error?.data?.message || "Verify your business details and try submitting again."}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Store Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                  Store Name <span className="text-neutral-400">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  maxLength={100}
                  className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none bg-white ${
                    localErrors.storeName 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-neutral-300 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                  placeholder="e.g. Apex Accessories Co."
                />
                <div className="flex justify-between items-center text-[11px] font-medium pt-0.5">
                  <span>
                    {localErrors.storeName && <p className="text-red-500">{localErrors.storeName}</p>}
                  </span>
                  <span className="text-neutral-400 font-mono tracking-tighter">
                    {formData.storeName.length}/100
                  </span>
                </div>
              </div>

              {/* Phone & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                    Contact Phone <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={20}
                    className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none bg-white ${
                      localErrors.phone 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-neutral-300 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                    placeholder="e.g. +1 555-0199"
                  />
                  {localErrors.phone && <p className="text-red-500 text-[11px] font-medium">{localErrors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                    Business Address <span className="text-neutral-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    maxLength={255}
                    className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none bg-white ${
                      localErrors.address 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-neutral-300 focus:border-black focus:ring-1 focus:ring-black"
                    }`}
                    placeholder="e.g. 123 Commerce St"
                  />
                  {localErrors.address && <p className="text-red-500 text-[11px] font-medium">{localErrors.address}</p>}
                </div>
              </div>

              {/* Store Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                  Store Description <span className="text-neutral-400">*</span>
                </label>
                <textarea
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 outline-none resize-none bg-white font-light leading-relaxed ${
                    localErrors.storeDescription 
                      ? "border-red-400 focus:border-red-500" 
                      : "border-neutral-300 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                  placeholder="Outline what products or accessories you plan to list on PriceTag..."
                />
                <div className="flex justify-between items-center text-[11px] font-medium pt-0.5">
                  <span>
                    {localErrors.storeDescription && <p className="text-red-500">{localErrors.storeDescription}</p>}
                  </span>
                  <span className="text-neutral-400 font-mono tracking-tighter">
                    {formData.storeDescription.length}/1000
                  </span>
                </div>
              </div>

              {/* Submission Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "Submitting Application..." : "Submit Seller Application"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default BecomeSeller;