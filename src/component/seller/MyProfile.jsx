import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery, useUpdateUserMutation } from '../../feature/user/userApi';


const MyProfile = () => {
  const navigate = useNavigate();
  
  const { data: user, isLoading, error, refetch } = useGetCurrentUserQuery(undefined, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateUser] = useUpdateUserMutation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'seller') return '/seller-dashboard';
    if (user?.role === 'customer') return '/customer-dashboard';
    return '/'; // fallback
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '👑';
      case 'customer':
        return '🛍️';
      default:
        return '👤';
    }
  };

  const handleChangePassword = async () => {
    if (!password) {
      alert('❌ Please enter a new password');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('❌ Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('❌ Password must be at least 6 characters long');
      return;
    }

    setIsUpdating(true);
    try {
      await updateUser({ id: user.id, password }).unwrap();
      alert('✅ Password updated successfully');
      setPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      alert('❌ Failed to update password');
      console.error('Password update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="min-h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Profile</h2>
              <p className="text-gray-500">Please wait while we fetch your information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mb-6">
              <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
              <p className="text-gray-600 mb-6">We couldn't load your profile information. Please try again.</p>
              <button 
                onClick={() => refetch()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Back Button */}
    <div className="mb-8">
      <button
        onClick={() => navigate(getDashboardPath())}
        className="inline-flex items-center text-neutral-600 hover:text-black font-medium transition-colors duration-200 text-sm tracking-wide"
      >
        <span className="mr-2">←</span>
        Back to Dashboard
      </button>
    </div>

    {/* Header */}
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <div className="bg-black p-2.5 rounded-xl shadow-sm">
          <span className="text-white text-xl">👤</span>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">My Profile</h1>
      </div>
      <p className="text-neutral-500 font-light">Manage your account information and settings</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Information Card */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
          <div className="bg-neutral-100/70 px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Profile Information</h2>
          </div>
          
          <div className="p-6">
            {/* Profile Avatar & Basic Info */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="bg-neutral-100 border border-neutral-200 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">
                <span className="text-4xl">{getRoleIcon(user.role)}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">{user.name}</h3>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium tracking-wide">ID: #{user.id}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/60">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <p className="text-neutral-900 font-bold text-sm">{user.name}</p>
                </div>
                
                <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/60">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <p className="text-neutral-900 font-bold text-sm">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/60">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Account Type</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getRoleIcon(user.role)}</span>
                    <span className="text-neutral-900 font-bold text-sm capitalize">{user.role}</span>
                  </div>
                </div>
                
                <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/60">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-1">Account Status</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                    <span className="text-neutral-900 font-bold text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Actions Card */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
            <div className="bg-neutral-100/70 px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center tracking-tight">
                <span className="mr-2">🔐</span>
                Security
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-2">
                <h4 className="font-bold text-neutral-900 mb-1 text-sm tracking-tight">Password</h4>
                <p className="text-xs text-neutral-500 font-light mb-5 leading-relaxed">Keep your account secure with a strong password</p>
                
                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-neutral-800 transition-all duration-300 font-medium text-sm tracking-wide shadow-sm hover:shadow-md"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200"
                        disabled={isUpdating}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1.5">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200"
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="flex space-x-3 pt-1">
                      <button
                        onClick={handleChangePassword}
                        disabled={isUpdating}
                        className="flex-1 bg-black text-white py-2.5 px-4 rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-xs tracking-wide"
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPassword('');
                          setConfirmPassword('');
                        }}
                        disabled={isUpdating}
                        className="flex-1 bg-neutral-100 text-neutral-700 border border-neutral-200 py-2.5 px-4 rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-xs tracking-wide"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden">
            <div className="bg-neutral-100/70 px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center tracking-tight">
                <span className="mr-2">📊</span>
                Account Stats
              </h3>
            </div>
            
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-light">Account Created</span>
                <span className="font-semibold text-neutral-900">Recently</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-light">Last Login</span>
                <span className="font-semibold text-neutral-900">Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-light">Profile Views</span>
                <span className="font-semibold text-neutral-900">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default MyProfile;