import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Invoice() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrder(data.find((o) => o._id === id));
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-10 text-black">

      <div className="max-w-3xl mx-auto bg-white shadow p-10 rounded">

        {/* HEADER */}
        <h2 className="text-3xl font-semibold mb-6">Invoice</h2>

        {/* ORDER INFO */}
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <hr className="my-5" />

        {/* CUSTOMER */}
        <h3 className="text-xl font-semibold">Billing Details</h3>
        <p>{order.billingAddress.name}</p>
        <p>{order.billingAddress.addressLine1}</p>
        <p>{order.billingAddress.city}, {order.billingAddress.state}</p>
        <p>{order.billingAddress.country}</p>

        <hr className="my-5" />

        {/* ITEMS */}
        <h3 className="text-xl font-semibold mb-3">Items</h3>

        {order.items.map((item) => (
          <div key={item._id} className="mb-4">
            <p>{item.productName} (x{item.quantity})</p>
            <p>₹ {item.itemTotal}</p>
          </div>
        ))}

        <hr className="my-5" />

        {/* TOTAL */}
        <h3 className="text-xl font-semibold">Total: ₹ {order.total}</h3>

      </div>

      {/* PRINT BUTTON */}
      <button
        onClick={() => window.print()}
        className="mt-6 bg-black text-white px-6 py-3 rounded"
      >
        Print Invoice
      </button>

    </div>
  );
}
