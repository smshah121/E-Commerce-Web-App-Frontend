// components/UpdateOrderStatus.jsx
import React from 'react';
import { useUpdateOrderStatusMutation } from '../../feature/order/orderApi';

const UpdateOrderStatus = ({ orderId, currentStatus }) => {
  const [status, setStatus] = React.useState(currentStatus);
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      alert('Order status updated!');
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="status" className="text-sm font-semibold text-gray-700">Order Status</label>
      <select
        id="status"
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
  );
};

export default UpdateOrderStatus;
