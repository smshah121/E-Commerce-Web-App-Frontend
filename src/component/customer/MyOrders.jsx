import React from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./NavbarCust"; // Assuming your CustomerNavbar is here
import { motion } from "framer-motion"; // Import motion for animations
import { FaBoxOpen, FaShoppingCart, FaMapMarkedAlt } from "react-icons/fa"; // Icons for empty state and order items, added FaMapMarkedAlt
import { useGetMyOrderQuery } from "../../feature/order/orderApi";

const MyOrders = () => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    navigate("/customer-dashboard");
  };



  const { data: orders = [], isLoading } = useGetMyOrderQuery();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
      case "completed": // Added 'completed' as a delivered status
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  const getPaymentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";

    case "pending":
      return "bg-yellow-100 text-yellow-800";

    case "failed":
      return "bg-red-100 text-red-800";

    case "refunded":
      return "bg-purple-100 text-purple-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-400 border-b-transparent"
            />
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Loading Your Orders
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch your order history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar /> {/* Include the Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 bg-neutral-50 min-h-screen text-neutral-900 antialiased">
  {/* Back Button */}
  <motion.button
    onClick={() => getDashboardPath()}
    className="mb-8 inline-flex items-center text-neutral-600 hover:text-black font-medium transition-colors duration-200 text-sm tracking-wide"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >
    <span className="mr-2">←</span>
    Back to Dashboard
  </motion.button>

  {/* Header */}
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex items-center space-x-3 mb-2">
      <div className="bg-black p-2.5 rounded-xl shadow-sm">
        <FaBoxOpen className="text-white text-xl" />
      </div>
      <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">My Orders</h1>
    </div>
    <p className="text-neutral-500 font-light">
      Track and manage all your orders in one place
    </p>
  </motion.div>

  {/* Orders Content */}
  {orders.length === 0 ? (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-12 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      }}
    >
      <div className="mb-6">
        <div className="bg-neutral-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
          <FaShoppingCart className="text-4xl text-neutral-400" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
          No Orders Yet
        </h3>
        <p className="text-neutral-500 font-light mb-6">
          You haven't placed any orders yet. Start shopping to see your
          orders here!
        </p>
        <button
          onClick={() => navigate("/customer-dashboard")}
          className="bg-black text-white px-8 py-3.5 rounded-xl font-medium hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg tracking-wide text-sm"
        >
          Start Shopping
        </button>
      </div>
    </motion.div>
  ) : (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {orders.map((order) => (
        <motion.div
          key={order.id}
          className="bg-white rounded-2xl shadow-sm border border-neutral-200/90 overflow-hidden hover:border-neutral-400 hover:shadow-md transition-all duration-300"
          variants={itemVariants}
        >
          {/* Order Header */}
          <div className="bg-neutral-100/70 px-6 py-4 border-b border-neutral-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-3 lg:mb-0">
                <div className="bg-black text-white px-3 py-1 rounded-lg text-xs font-semibold tracking-wider">
                  #{order.id}
                </div>
                <div>
                  <p className="font-bold text-neutral-900">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-neutral-500 font-light">
                    Placed on{" "}
                    {new Date(order.orderedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

                <div className="text-right ml-auto">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Total</p>
                  <p className="text-lg font-bold text-neutral-900">
                    ${parseFloat(order.total)?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Address */}
          <div className="px-6 py-4 border-b border-neutral-200/80">
            <h4 className="font-semibold text-neutral-900 mb-1 flex items-center text-sm tracking-wide">
              <FaMapMarkedAlt className="mr-2 text-neutral-700" /> Shipment Address
            </h4>
            <p className="text-neutral-600 text-sm font-light">
              {order.street}, {order.city}, {order.state},{" "}
              {order.postalCode}, {order.country}
            </p>
          </div>

          {/* Payment Information */}
          <div className="px-6 py-4 border-b border-neutral-200/80">
            <h4 className="font-semibold text-neutral-900 mb-3 text-sm tracking-wide">
              Payment Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Payment Method</p>
                <p className="font-medium text-neutral-900 text-sm mt-0.5">
                  {order.paymentMethod === "ONLINE"
                    ? "Online Payment"
                    : "Cash on Delivery"}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Payment Status</p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getPaymentStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="px-6 py-4">
            <h4 className="font-semibold text-neutral-900 mb-4 flex items-center text-sm tracking-wide">
              <span className="mr-2">📦</span>
              Items ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 hover:bg-neutral-100/80 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <img
                      src={
                        item.product?.images?.[0]?.image
                          ? item.product.images[0].image
                          : "https://placehold.co/60x60/F5F5F5/171717?text=Item"
                      }
                      alt={item.product?.images?.[0]?.altText || item.product?.name || "Product"}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-neutral-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2I...=";
                      }}
                    />

                    <div>
                      <h5 className="font-semibold text-neutral-900 text-sm">
                        {item.product?.name || "Unknown Product"}
                      </h5>
                      <p className="text-xs text-neutral-500 font-light mt-0.5">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 text-sm">
                      $
                      {(item.product?.price
                        ? parseFloat(item.product.price) * item.quantity
                        : 0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-neutral-500 text-center mt-2 font-medium">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>

          {/* Order Footer */}
          <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-6 mb-3 sm:mb-0">
              <button
                onClick={() => navigate(`/my-orders/${order.id}`)}
                className="text-neutral-900 hover:text-neutral-600 font-semibold text-xs tracking-wider uppercase transition-colors duration-200 underline underline-offset-4"
              >
                View Details
              </button>

              {order.status?.toLowerCase() === "delivered" && (
                <button className="text-neutral-900 hover:text-neutral-600 font-semibold text-xs tracking-wider uppercase transition-colors duration-200">
                  Reorder
                </button>
              )}
            </div>
            <p className="text-xs text-neutral-500 font-light">
              Order Total:{" "}
              <span className="font-bold text-neutral-900 text-sm ml-1">
                ${parseFloat(order.total)?.toFixed(2) || "0.00"}
              </span>
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )}

  {/* Orders Summary */}
  {orders.length > 0 && (
    <motion.div
      className="mt-8 bg-white rounded-2xl shadow-sm border border-neutral-200/90 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
        <div className="pt-4 md:pt-0">
          <p className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            {orders.length}
          </p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mt-1">Total Orders</p>
        </div>
        <div className="pt-4 md:pt-0">
          <p className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            {
              orders.filter(
                (order) =>
                  order.status?.toLowerCase() === "delivered" ||
                  order.status?.toLowerCase() === "completed"
              ).length
            }
          </p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mt-1">Delivered</p>
        </div>
        <div className="pt-4 md:pt-0">
          <p className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            $
            {orders
              .reduce(
                (total, order) =>
                  total + (order.total ? parseFloat(order.total) : 0),
                0
              )
              .toFixed(2)}
          </p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mt-1">Total Spent</p>
        </div>
      </div>
    </motion.div>
  )}
</div>
    </div>
  );
};

export default MyOrders;
