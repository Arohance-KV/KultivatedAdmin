import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../../redux/OrderSlice";

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  // Fetch order details from API
  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  if (loading)
    return <p className="p-6 text-center text-lg">Loading order...</p>;

  if (error)
    return <p className="p-6 text-center text-red-600">{error}</p>;

  if (!singleOrder)
    return <p className="p-6">Order not found.</p>;

  const order = singleOrder;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Order #{order.orderNumber}
      </h2>

      <div className="bg-white shadow p-6 rounded-lg space-y-6">

        {/* SHIPPING ADDRESS */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p>{order.shippingAddress.addressLine2}</p>
          )}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>

        {/* BILLING ADDRESS */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Billing Address</h3>
          <p>{order.billingAddress.name}</p>
          <p>{order.billingAddress.addressLine1}</p>
          <p>
            {order.billingAddress.city}, {order.billingAddress.state}
          </p>
          <p>{order.billingAddress.country}</p>
          <p>Phone: {order.billingAddress.phone}</p>
        </div>

        {/* PAYMENT INFO */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Payment Info</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>Status: {order.paymentStatus}</p>
          <p>Subtotal: ₹{order.subtotal}</p>
          <p>Discount: ₹{order.totalDiscountAmount}</p>
          <p>Shipping: ₹{order.shippingCharge}</p>
          <p>Tax: ₹{order.taxAmount}</p>
          <p className="font-semibold text-lg mt-1">
            Total: ₹{order.total}
          </p>
        </div>

        {/* TRACKING */}
        {order.trackingNumber && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Tracking</h3>
            <p>Tracking Number: {order.trackingNumber}</p>
            {order.estimatedDeliveryDate && (
              <p>
                Estimated Delivery:{" "}
                {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* ITEMS */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Items</h3>

          {order.items.map((item) => (
            <div
              key={item._id}
              className="border p-3 rounded mb-3 flex gap-4"
            >
              <img
                src={item.productImage}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p>Product ID: {item.productId}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.priceAtPurchase}</p>
                <p>Total: ₹{item.itemTotal}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
