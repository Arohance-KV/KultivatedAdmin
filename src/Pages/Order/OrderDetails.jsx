import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    const found = data.find((o) => o._id === id);
    setOrder(found);
  }, [id]);

  if (!order) return <p className="p-6">Order not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order #{order.orderNumber}</h2>

      <div className="bg-white shadow p-6 rounded-lg space-y-6">

        {/* Shipping Address */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>{order.shippingAddress.country}</p>
        </div>

        {/* Items List */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Items</h3>
          {order.items.map((item) => (
            <div key={item._id} className="border p-3 rounded mb-3">
              <p><strong>{item.productName}</strong></p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.itemTotal}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
