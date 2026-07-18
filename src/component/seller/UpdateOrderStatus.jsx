import React from 'react';
import {
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
} from '../../feature/order/orderApi';

const UpdateOrderStatus = ({
  orderId,
  currentStatus,
  paymentMethod,
  currentPaymentStatus,
}) => {
  const [status, setStatus] = React.useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = React.useState(
    currentPaymentStatus,
  );

  const [updateOrderStatus, { isLoading }] =
    useUpdateOrderStatusMutation();

  const [updatePaymentStatus, { isLoading: paymentLoading }] =
    useUpdatePaymentStatusMutation();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
      }).unwrap();

      alert('Order status updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handlePaymentStatusChange = async (e) => {
    const newStatus = e.target.value;
    setPaymentStatus(newStatus);

    try {
      await updatePaymentStatus({
        orderId,
        paymentStatus: newStatus,
      }).unwrap();

      alert('Payment status updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating payment status');
    }
  };

  return (
    <div className="space-y-4">
      {/* Order Status */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Order Status
        </label>

        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isLoading}
          className="w-full p-2 border rounded"
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Payment Status - Only for COD */}
      {paymentMethod === 'COD' && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Payment Status
          </label>

          <select
            value={paymentStatus}
            onChange={handlePaymentStatusChange}
            disabled={paymentLoading}
            className="w-full p-2 border rounded"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default UpdateOrderStatus;