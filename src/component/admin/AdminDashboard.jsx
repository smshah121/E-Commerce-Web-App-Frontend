import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  useGetSellerApplicationsQuery, 
  useApproveSellerApplicationMutation, 
  useRejectSellerApplicationMutation 
} from '../../feature/seller-application/sellerApplicationApi';
import { useGetCurrentUserQuery } from '../../feature/user/userApi'; // Ensure this path points to your userApi slice
import { clearToken } from '../../feature/auth/authSlice'; // Path to your authSlice

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
        alert(err?.data?.message || "Failed to approve application");
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      try {
        await rejectApplication(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || "Failed to reject application");
      }
    }
  };

  // Loading Screen
  if (isAppsLoading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50">
        <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading workspace...</p>
      </div>
    );
  }

  // Error Screen
  if (isAppsError || isUserError) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <p className="text-red-700 font-semibold text-lg">Unable to authenticate or load applications</p>
        <p className="text-red-500 text-sm mt-1">Make sure you are logged in as an Administrator.</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700">
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
    <div className="min-h-screen bg-gray-50/50">
      {/* --- Premium Admin Header --- */}
      <nav className="sticky top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/admin-dashboard" className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUserShield className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    PriceTag Admin
                  </span>
                  <span className="text-[10px] font-medium text-purple-500 tracking-wider uppercase">
                    Management Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Side: Admin Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-100"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">
                    {getInitials(currentUser)}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-semibold text-gray-700">
                  {currentUser?.name || 'Administrator'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 z-20 overflow-hidden">
                    <div className="py-2">
                      {/* Dynamic Identity Details */}
                      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                        <p className="text-base font-bold text-gray-900">{currentUser?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email || 'admin@pricetag.com'}</p>
                      </div>

                      {/* Profile Button */}
                      <button 
                        onClick={() => { navigate('/my-profile'); setShowDropdown(false); }} 
                        className="flex items-center w-full px-6 py-3.5 hover:bg-gray-50 text-sm text-gray-700 transition-all duration-300"
                      >
                        <CgProfile className="w-5 h-5 mr-4 text-purple-500" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold">My Profile</div>
                          <div className="text-xs text-gray-400">Manage security details</div>
                        </div>
                      </button>

                      <hr className="my-1.5 border-gray-100" />

                      {/* Dynamic Logout Button using select redux hook */}
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-6 py-3.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all duration-300"
                      >
                        <TbLogout className="w-5 h-5 mr-4 text-red-500" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold">Logout</div>
                          <div className="text-xs text-gray-400">Sign out securely</div>
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Applications</h1>
            <p className="text-gray-500 mt-1">Review, approve, or reject customer requests to set up custom storefronts.</p>
          </div>
          <span className="self-start sm:self-auto bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-xl text-sm border border-indigo-100">
            Total Requests: {applications.length}
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl shadow-sm">
            <FaStore className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-lg">No application requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {applications.map((app) => {
              const appStatus = String(app.status || 'PENDING').toUpperCase();
              const applicantId = app.user?.id || app.userId || 'N/A';
              const applicantEmail = app.user?.email ? ` (${app.user.email})` : '';

              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl text-indigo-600">
                          <FaStore className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{app.storeName}</h3>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Applicant ID: #{applicantId}{applicantEmail}
                          </p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        appStatus === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                        appStatus === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse'
                      }`}>
                        {appStatus}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <FaPhoneAlt className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">{app.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{app.address}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Store Description</h4>
                      <p className="text-sm text-gray-700 bg-white border border-gray-100 p-3 rounded-xl leading-relaxed max-h-32 overflow-y-auto">
                        {app.storeDescription}
                      </p>
                    </div>
                  </div>

                  {appStatus === 'PENDING' && (
                    <div className="flex border-t border-gray-100 bg-gray-50/50 p-4 space-x-3">
                      <button
                        onClick={() => handleReject(app.id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold rounded-xl text-sm transition cursor-pointer"
                      >
                        <FaTimes className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                      >
                        <FaCheck className="w-3.5 h-3.5" />
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