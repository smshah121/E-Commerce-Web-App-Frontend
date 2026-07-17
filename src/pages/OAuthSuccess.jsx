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
    } else {
      alert('OAuth authorization handshake failed.');
      navigate('/');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      <p className="text-slate-600 font-semibold text-sm tracking-wide">Securing decentralized session certificates...</p>
    </div>
  );
};

export default OauthSuccess;