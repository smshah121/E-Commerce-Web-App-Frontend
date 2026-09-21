import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  useGetSellerApplicationsQuery, 
  useApproveSellerApplicationMutation, 
  useRejectSellerApplicationMutation 
} from '../../feature/seller-application/sellerApplicationApi';
import { useGetCurrentUserQuery } from '../../feature/user/userApi';
import { clearToken } from '../../feature/auth/authSlice';

import { 
  FaCheck, 
  FaTimes, 
  FaStore, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaSpinner, 
  FaUserShield 
} from 'react-icons/fa';
import { TbLogout } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  // 1. Fetch Admin Profile from /auth/profile
  const { 
    data: currentUser, 
    isLoading: isUserLoading, 
    isError: isUserError 
  } = useGetCurrentUserQuery();

  // 2. Fetch all applications
  const { 
    data: applications = [], 
    isLoading: isAppsLoading, 
    isError: isAppsError, 
    refetch 
  } = useGetSellerApplicationsQuery();

  // 3. Setup mutations
  const [approveApplication, { isLoading: isApproving }] = useApproveSellerApplicationMutation();
  const [rejectApplication, { isLoading: isRejecting }] = useRejectSellerApplicationMutation();

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this application? This will grant the customer seller access.")) {
      try {
        await approveApplication(id).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to approve application");
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      try {
        await rejectApplication(id).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to reject application");
      }
    }
  };

  // Loading Screen
  if (isAppsLoading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-neutral-50 text-neutral-900">
        <FaSpinner className="w-8 h-8 text-black animate-spin" />
        <p className="text-neutral-500 font-medium text-sm">Loading workspace...</p>
      </div>
    );
  }

  // Error Screen
  if (isAppsError || isUserError) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-8 bg-neutral-900 border border-neutral-800 text-white rounded-2xl text-center shadow-lg">
        <p className="text-white font-bold text-lg">Unable to authenticate or load applications</p>
        <p className="text-neutral-400 text-sm mt-1 font-light">Make sure you are logged in as an Administrator.</p>
        <button 
          onClick={refetch} 
          className="mt-5 px-5 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Generate an avatar initials backup (e.g., "JD" for "John Doe")
  const getInitials = (user) => {
    if (!user) return "A";
    if (user.name) {
      return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user.email ? user.email[0].toUpperCase() : "A";
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
      {/* --- Premium Monochrome Admin Header --- */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 border-b border-neutral-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/admin-dashboard" className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 border border-neutral-800">
                  <FaUserShield className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-neutral-900 tracking-tight">
                    PriceTag Admin
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-400 tracking-widest uppercase">
                    Management Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Side: Admin Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-neutral-100 border border-transparent hover:border-neutral-200"
              >
                <div className="w-9 h-9 bg-black border border-neutral-800 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold tracking-wider">
                    {getInitials(currentUser)}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-semibold text-neutral-800">
                  {currentUser?.name || 'Administrator'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-2xl border border-neutral-200 z-20 overflow-hidden">
                    <div className="py-2">
                      {/* Dynamic Identity Details */}
                      <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-150">
                        <p className="text-base font-bold text-neutral-900 tracking-tight">{currentUser?.name || 'Admin'}</p>
                        <p className="text-xs text-neutral-500 font-light truncate">{currentUser?.email || 'admin@pricetag.com'}</p>
                      </div>

                      {/* Profile Button */}
                      <button 
                        onClick={() => { navigate('/my-profile'); setShowDropdown(false); }} 
                        className="flex items-center w-full px-6 py-3.5 hover:bg-neutral-50 text-sm text-neutral-700 hover:text-black transition-all duration-200"
                      >
                        <CgProfile className="w-5 h-5 mr-4 text-neutral-500" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-neutral-900 text-xs uppercase tracking-wider">My Profile</div>
                          <div className="text-[11px] text-neutral-400 font-light">Manage security details</div>
                        </div>
                      </button>

                      <hr className="my-1 border-neutral-100" />

                      {/* Dynamic Logout Button */}
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-6 py-3.5 hover:bg-neutral-50 text-sm text-neutral-700 hover:text-red-600 transition-all duration-200"
                      >
                        <TbLogout className="w-5 h-5 mr-4 text-neutral-400 hover:text-red-500" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-xs uppercase tracking-wider">Logout</div>
                          <div className="text-[11px] text-neutral-400 font-light">Sign out securely</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Workspace --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Seller Applications</h1>
            <p className="text-neutral-500 text-sm mt-1 font-light">Review, approve, or reject customer requests to set up custom storefronts.</p>
          </div>
          <span className="self-start sm:self-auto bg-black text-white font-medium px-4 py-2 rounded-xl text-xs uppercase tracking-wider border border-black shadow-sm">
            Total Requests: {applications.length}
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-200/90 rounded-2xl shadow-sm">
            <FaStore className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium text-base tracking-tight">No application requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {applications.map((app) => {
              const appStatus = String(app.status || 'PENDING').toUpperCase();
              const applicantId = app.user?.id || app.userId || 'N/A';
              const applicantEmail = app.user?.email ? ` (${app.user.email})` : '';

              return (
                <div key={app.id} className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
                          <FaStore className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">{app.storeName}</h3>
                          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
                            Applicant ID: #{applicantId}{applicantEmail}
                          </p>
                        </div>
                      </div>

                      {/* Monochrome Status Badges */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                        appStatus === 'APPROVED' ? 'bg-neutral-900 text-white border-neutral-900' :
                        appStatus === 'REJECTED' ? 'bg-neutral-100 text-neutral-500 border-neutral-300 line-through' :
                        'bg-white text-neutral-900 border-neutral-900'
                      }`}>
                        {appStatus}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 font-light">
                      <div className="flex items-center space-x-2">
                        <FaPhoneAlt className="w-3 h-3 text-neutral-400" />
                        <span className="font-medium text-neutral-800">{app.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{app.address}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Store Description</h4>
                      <p className="text-xs text-neutral-700 bg-neutral-50/50 border border-neutral-200 p-3.5 rounded-xl leading-relaxed max-h-32 overflow-y-auto font-light">
                        {app.storeDescription}
                      </p>
                    </div>
                  </div>

                  {appStatus === 'PENDING' && (
                    <div className="flex border-t border-neutral-200/80 bg-neutral-50/60 p-4 space-x-3">
                      <button
                        onClick={() => handleReject(app.id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                      >
                        <FaTimes className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                      
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-black text-white hover:bg-neutral-800 font-semibold rounded-xl text-xs uppercase tracking-wider transition shadow-sm hover:shadow active:scale-[0.99] cursor-pointer disabled:opacity-50"
                      >
                        <FaCheck className="w-3 h-3" />
                        <span>Approve Application</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;