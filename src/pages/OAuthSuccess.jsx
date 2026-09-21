import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../feature/auth/authSlice'; // Adjust import path to match your structure

const OauthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const id = searchParams.get('id');

    if (token && role && id) {
      
      localStorage.setItem('token', token);
    
      localStorage.setItem('id', id);

      
      dispatch(setToken({ token, role }));

     
      if (role.toLowerCase() === 'customer') {
        navigate('/customer-dashboard');
      } 
      else if (role.toLowerCase() === 'seller') {
        navigate('/seller-dashboard');
      } 
    } else {
      toast.error('OAuth authorization handshake failed.');
      navigate('/');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center space-y-4 text-neutral-900 antialiased">
  {/* Minimalist Monochrome Spinner */}
  <div className="relative">
    <div className="w-12 h-12 rounded-full border-2 border-neutral-200"></div>
    <div className="w-12 h-12 rounded-full border-2 border-black border-t-transparent animate-spin absolute top-0 left-0"></div>
  </div>

  {/* PriceTag Brand Loading Text */}
  <div className="text-center space-y-1">
    <p className="text-sm font-bold text-neutral-900 tracking-tight">
      Authenticating with PriceTag...
    </p>
    <p className="text-xs text-neutral-500 font-light tracking-wide">
      Verifying your account details, please wait a moment
    </p>
  </div>
</div>
  );
};

export default OauthSuccess;