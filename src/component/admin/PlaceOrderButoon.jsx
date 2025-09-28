
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../../feature/order/orderApi';
import { clearCart } from '../../feature/cart/cartSlice';

const PlaceOrderButton = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { items: cart, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderDto = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price, // Include price for order record
      })),
      totalAmount: totalAmount,
      totalQuantity: totalQuantity,
    };

    try {
      const result = await createOrder(orderDto).unwrap();
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      alert(`Order placed successfully! Order ID: ${result.id || 'N/A'}`);
      console.log('Order created:', result);
    } catch (err) {
      console.error('Order creation failed:', err);
      
      // Better error handling
      const errorMessage = err?.data?.message || err?.message || 'Error placing order';
      alert(`Failed to place order: ${errorMessage}`);
    }
  };

  // Don't render if cart is empty
  if (cart.length === 0) {
    return null;
  }

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={isLoading || cart.length === 0}
      className={`bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Placing Order...
        </span>
      ) : (
        `Place Order ($${totalAmount.toFixed(2)})`
      )}
    </button>
  );
};

export default PlaceOrderButton;