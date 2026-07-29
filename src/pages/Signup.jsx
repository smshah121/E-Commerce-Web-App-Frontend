import  { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignupMutation } from "../feature/auth/authApi";

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const validatePasswords = () => {
    let isValid = true;

    // Check password length
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Check password match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validatePasswords();

    if (!isValid) {
      return;
    }
    try {
      const res = await signup({ name, email, password }).unwrap();
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("id", res.id);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.log("signup failed", err);
    }
  };

  return (
   <div className="min-h-screen bg-white text-gray-950">

  {/* Header */}
  <div className="border-b border-gray-100">
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="group flex items-center gap-3"
      >
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
          Create Your Account
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
          Join PriceTag and start your shopping journey.
        </p>
      </div>

      {/* Signup Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">

        {/* Card Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-950">
            Create Account
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your details to create your PriceTag account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            />
          </div>

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
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            {/* Password Error */}
            {passwordError && (
              <p className="mb-2 text-sm font-medium text-red-600">
                {passwordError}
              </p>
            )}

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  const value = e.target.value;

                  setPassword(value);

                  if (value.length >= 8) {
                    setPasswordError("");
                  } else if (value.length > 0) {
                    setPasswordError(
                      "Password must be at least 8 characters."
                    );
                  }

                  // Check confirm password again
                  if (confirmPassword && value !== confirmPassword) {
                    setConfirmPasswordError("Passwords do not match.");
                  } else if (
                    confirmPassword &&
                    value === confirmPassword
                  ) {
                    setConfirmPasswordError("");
                  }
                }}
                placeholder="Enter your password"
                className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-gray-950/10 ${
                  passwordError
                    ? "border-red-500 focus:border-red-500"
                    : password.length >= 8
                    ? "border-green-500 focus:border-green-500"
                    : "border-gray-300 hover:border-gray-400 focus:border-gray-950"
                }`}
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 3.043 9.542 7-1.274 3.957-5.064 7-9.542 7-4.477 0-8.268-3.043-9.542-7z"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            {/* Confirm Password Error */}
            {confirmPasswordError && (
              <p className="mb-2 text-sm font-medium text-red-600">
                {confirmPasswordError}
              </p>
            )}

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;

                  setConfirmPassword(value);

                  if (value !== password) {
                    setConfirmPasswordError(
                      "Passwords do not match."
                    );
                  } else {
                    setConfirmPasswordError("");
                  }
                }}
                placeholder="Confirm your password"
                className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 focus:ring-2 ${
                  confirmPasswordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : confirmPassword.length > 0 &&
                      confirmPassword === password
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500/10"
                    : "border-gray-300 hover:border-gray-400 focus:border-gray-950 focus:ring-gray-950/10"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-900"
              >
                {showConfirmPassword ? (
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 3.043 9.542 7-1.274 3.957-5.064 7-9.542 7z"
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

            {/* Success Message */}
            {confirmPassword.length > 0 &&
              confirmPassword === password &&
              password.length >= 8 && (
                <p className="mt-2 text-sm font-medium text-green-600">
                  Passwords match.
                </p>
              )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                {error?.data?.message ||
                  "Unable to create account. Please try again."}
              </p>
            </div>
          )}

          {/* Create Account */}
          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating your account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Create PriceTag Account</span>

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

       

        {/* Login Link */}
        <div className="mt-7 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-gray-950 underline underline-offset-4 transition-colors hover:text-gray-600"
            >
              Sign in
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

export default Signup;
