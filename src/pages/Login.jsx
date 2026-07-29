import  { useState } from 'react';
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
   <div className="min-h-screen bg-white text-gray-950">
  {/* Header */}
  <div className="border-b border-gray-100">
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <Link to="/" className="group flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
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

        <span className="text-2xl font-bold tracking-tight text-gray-950">
          PriceTag
        </span>
      </Link>
    </div>
  </div>

  {/* Main */}
  <main className="flex min-h-[calc(100vh-89px)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">

      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
          Sign in to continue your shopping journey.
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">

        {/* Card Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-950">
            Sign In
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Access your PriceTag account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-12 text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-900"
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
                      strokeWidth={2}
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
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
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
              className="h-4 w-4 rounded border-gray-300 text-black accent-black focus:ring-black"
            />

            <label
              htmlFor="remember-me"
              className="ml-3 text-sm text-gray-600"
            >
              Remember me
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                {error?.data?.message ||
                  "Invalid credentials. Please try again."}
              </p>
            </div>
          )}

          {/* Black Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing you in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Sign In to PriceTag</span>

                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
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

          Sign in with Google
        </button>

        {/* Sign Up */}
        <div className="mt-7 text-center">
          <p className="text-sm text-gray-500">
            New to PriceTag?{" "}
            <Link
              to="/signup"
              className="font-semibold text-gray-950 underline underline-offset-4 transition-colors hover:text-gray-600"
            >
              Create your account
            </Link>
          </p>
        </div>
      </div>

      {/* Back Home */}
      <div className="mt-7 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-black"
        >
          <svg
            className="h-4 w-4"
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