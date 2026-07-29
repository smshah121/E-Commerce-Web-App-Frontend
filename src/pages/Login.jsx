import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useLoginMutation } from '../feature/auth/authApi';
import { setToken } from '../feature/auth/authSlice';
import { userApi } from '../feature/user/userApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('🔄 Starting login process...');
        console.log('📧 Email:', email);
        
        const res = await login({ email, password }).unwrap();
        
        // DEBUG: Log the complete server response
        console.log('🔍 Complete server response:', res);
        console.log('🔍 Token from server:', res.access_token);
        console.log('🔍 Role from server:', res.role);
        console.log('🔍 Role type:', typeof res.role);
        
        // Pass an object with both token and role
        dispatch(setToken({ token: res.access_token, role: res.role }));
        
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('role', res.role);
        
        // DEBUG: Verify what was stored in localStorage
        console.log('💾 Token stored in localStorage:', localStorage.getItem('token'));
        console.log('💾 Role stored in localStorage:', localStorage.getItem('role'));
        console.log('💾 Role type in localStorage:', typeof localStorage.getItem('role'));
        
        dispatch(userApi.util.invalidateTags(['CurrentUser']));
        
        // DEBUG: Log navigation decision
        console.log('🧭 Navigation logic:');
        console.log('   res.role === "customer":', res.role === 'customer');
        console.log('   res.role === "seller":', res.role === 'seller');
        console.log('   About to navigate to:', res.role === 'customer' ? 'customer-dashboard' : res.role === 'seller' ? 'admin-dashboard' : 'dashboard');
        
        if (res.role === 'customer') {
            console.log('➡️ Navigating to customer dashboard');
            navigate('/customer-dashboard');
        } else if (res.role === 'seller') {
            console.log('➡️ Navigating to seller dashboard');
            navigate('/seller-dashboard');
        }  else if (res.role === "admin"){
             navigate("/admin-dashboard")
        }
        
        
        else {
            console.log('➡️ Navigating to default dashboard');
            navigate('/dashboard');
        }
        
        // DEBUG: Final verification after a short delay
        setTimeout(() => {
            console.log('🔍 Final verification after navigation:');
            console.log('   localStorage role:', localStorage.getItem('role'));
            console.log('   Current URL:', window.location.pathname);
        }, 100);
        
    } catch (error) {
        console.error('❌ Login failed:', error);
    }
};

const handleGoogleLogin = () => {
    console.log('🌐 Redirecting to Google Auth...');
    // Redirect path to your NestJS Google passport endpoint (usually '/auth/google')
    window.location.href =  `${import.meta.env.VITE_API_URL}auth/google`
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

  {/* Background Glow Effects */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
    <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
    <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[140px]" />

    {/* Subtle Grid */}
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #ffffff 1px, transparent 1px),
          linear-gradient(to bottom, #ffffff 1px, transparent 1px)
        `,
        backgroundSize: "4rem 4rem",
      }}
    />
  </div>

  {/* Header */}
  <header className="relative z-10 px-6 py-6">
    <div className="mx-auto flex max-w-7xl items-center justify-between">

      <Link
        to="/"
        className="group flex items-center gap-3"
      >
        {/* Logo */}
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>

          <div className="absolute -inset-2 -z-10 rounded-2xl bg-blue-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div>
          <span className="block text-xl font-bold tracking-tight">
            PriceTag
          </span>

          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
            Premium Marketplace
          </span>
        </div>
      </Link>

      {/* Secure Status */}
      <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
        <span className="text-xs font-medium text-gray-400">
          Secure Login
        </span>
      </div>

    </div>
  </header>


  {/* Main */}
  <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-12 sm:px-6">

    <div className="w-full max-w-md">

      {/* Welcome */}
      <div className="mb-8 text-center">

        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl">
          <svg
            className="h-7 w-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
          Sign in to continue your shopping journey with PriceTag.
        </p>

      </div>


      {/* Login Card */}
      <div className="relative">

        {/* Card Glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-blue-500/10 opacity-70" />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0d]/95 shadow-2xl backdrop-blur-xl">

          {/* Top Accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

          <div className="p-6 sm:p-8">

            {/* Form Header */}
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-white">
                Sign in to your account
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your details below to access your account.
              </p>
            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>

                <div className="group relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                      className="h-5 w-5 text-gray-600 transition-colors group-focus-within:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 hover:border-white/20 focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>
              </div>


              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-gray-500 transition-colors hover:text-blue-400"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="group relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                      className="h-5 w-5 text-gray-600 transition-colors group-focus-within:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 hover:border-white/20 focus:border-blue-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 transition-colors hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>

                </div>
              </div>


              {/* Remember Me */}
              <div className="flex items-center">

                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/20"
                />

                <label
                  htmlFor="remember-me"
                  className="ml-3 text-sm text-gray-500"
                >
                  Remember me
                </label>

              </div>


              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
                  <div className="flex items-center gap-3">

                    <svg
                      className="h-5 w-5 shrink-0 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p className="text-sm text-red-300">
                      {error?.data?.message ||
                        "Invalid credentials. Please try again."}
                    </p>

                  </div>
                </div>
              )}


              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-white py-3.5 px-6 text-sm font-bold text-black transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isLoading ? (
                  <div className="flex items-center gap-3">

                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />

                    <span>
                      Signing you in...
                    </span>

                  </div>
                ) : (
                  <div className="flex items-center gap-2">

                    <span>
                      Sign In to PriceTag
                    </span>

                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>

                  </div>
                )}

              </button>

            </form>


            {/* Divider */}
            <div className="relative my-7">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-[#0b0b0d] px-4 text-xs font-medium text-gray-600">
                  OR CONTINUE WITH
                </span>
              </div>

            </div>


            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
            >

              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.98 15.45 1 12.24 1 5.48 1 0 6.373 0 13s5.48 12 12.24 12c7.06 0 11.758-4.887 11.758-11.74 0-.79-.08-1.39-.18-1.975H12.24z"
                />
              </svg>

              <span>
                Sign in with Google
              </span>

            </button>


            {/* Signup */}
            <div className="mt-7 text-center">

              <p className="text-sm text-gray-500">
                New to PriceTag?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-white transition-colors hover:text-blue-400"
                >
                  Create your account
                </Link>
              </p>

            </div>

          </div>

        </div>
      </div>


      {/* Back Home */}
      <div className="mt-7 text-center">

        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
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

          Back to PriceTag Home
        </Link>

      </div>

    </div>

  </main>

</div>
  );
};

export default Login;