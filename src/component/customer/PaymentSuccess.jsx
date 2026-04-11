import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import CustomerNavbar from './NavbarCust';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <CustomerNavbar />
      <div className='flex justify-center items-center min-h-screen'>
         <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 text-center  max-w-md w-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="text-green-500 flex justify-center text-6xl mb-6 mx-auto"
        >
          <FaCheckCircle />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-700 text-lg mb-6">
          Thank you for your payment. Your order has been confirmed and will be processed shortly.
        </p>
        <motion.button
          onClick={() => navigate('/my-orders')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View My Orders
        </motion.button>
      </div>

      </div>
     
    </div>
  );
};

export default PaymentSuccessPage;