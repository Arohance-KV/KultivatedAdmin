import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Truck,
  PackageCheck,
  Printer,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  fetchOrderById,
} from "../../redux/OrderSlice";

export default function Order() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const BRAND = "#c28356";

  // LOAD ORDERS
  useEffect(() => {
    dispatch(fetchAllOrders({ page: 1, limit: 50 }));
  }, [dispatch]);

  // FILTER ORDERS
  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (search.trim() !== "") {
      data = data.filter((o) =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((o) => o.status === statusFilter);
    }

    return data;
  }, [search, statusFilter, orders]);

  // STATUS UPDATE
  const handleStatusUpdate = (order) => {
    let nextStatus =
      order.status === "pending"
        ? "processing"
        : order.status === "processing"
        ? "shipped"
        : order.status === "shipped"
        ? "delivered"
        : order.status;

    dispatch(updateOrderStatus({ id: order._id, status: nextStatus }))
      .unwrap()
      .then(() => dispatch(fetchAllOrders({ page: 1, limit: 50 })));
  };

  const openOrderDetails = (order) => {
    dispatch(fetchOrderById(order._id)).then((res) => {
      setSelectedOrder(res.payload);
    });
  };

  /* ------------------------------ LOADING ------------------------------ */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: BRAND }}
        ></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600 text-lg">
        {error}
      </div>
    );
  }

  /* ------------------------------ UI START ------------------------------ */

  return (
    <div
      className="p-8"
      style={{
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#c28356] drop-shadow-sm tracking-wide">
          Orders
        </h1>
      </div>

      {/* FILTER BAR — GLASS */}
      {/* FILTER BAR — GLASS */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl shadow-xl border mb-8"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        {/* Left: Search */}
        <div className="flex items-center w-full md:w-1/3 bg-white/70 rounded-xl px-4 py-2 border shadow-sm">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search Order Number..."
            className="ml-2 w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Right: Status Filter */}
        <div className="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2 border shadow-sm md:ml-auto">
          <Filter className="text-gray-600" size={20} />
          <select
            className="bg-transparent outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* ORDER TABLE — GLASS */}
      <div
        className="overflow-x-auto rounded-2xl shadow-xl border"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(255,255,255,0.35)",
        }}
      >
        <table className="w-full text-left">
          <thead
            style={{ background: "rgba(255,255,255,0.45)" }}
            className="text-gray-700"
          >
            <tr>
              <th className="p-4">Order Number</th>
              <th className="p-4">User</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500 text-lg"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((o, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-white/40 transition cursor-pointer"
                >
                  <td className="p-4 font-medium">{o.orderNumber}</td>
                  <td className="p-4">{o.user}</td>
                  <td className="p-4 capitalize">{o.status}</td>
                  <td className="p-4 font-semibold text-gray-700">
                    ₹{o.total}
                  </td>
                  <td className="p-4">{o.paymentStatus}</td>

                  <td className="p-4 flex justify-center gap-4">
                    {/* View */}
                    <button
                      className="text-[#c28356] hover:scale-110 transition"
                      onClick={() => openOrderDetails(o)}
                    >
                      <Eye size={22} />
                    </button>

                    {/* Status update */}
                    <button
                      className="text-green-600 hover:scale-110 transition"
                      onClick={() => handleStatusUpdate(o)}
                    >
                      {o.status === "pending" && <Truck size={22} />}
                      {o.status === "processing" && <Truck size={22} />}
                      {o.status === "shipped" && <PackageCheck size={22} />}
                    </button>

                    {/* Print */}
                    <button className="text-gray-700 hover:scale-110 transition">
                      <Printer size={22} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------------- ORDER DETAILS MODAL (GLASS) ---------------------- */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div
            className="rounded-2xl p-6 w-full max-w-3xl shadow-2xl overflow-y-auto max-h-[85vh] relative border"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(255,255,255,0.35)",
            }}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[#c28356]">
              Order Details — {selectedOrder.orderNumber}
            </h2>

            {/* SHIPPING */}
            <GlassSection title="Shipping Address">
              <p>{selectedOrder.shippingAddress.name}</p>
              <p>{selectedOrder.shippingAddress.addressLine1}</p>
              <p>
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state}
              </p>
            </GlassSection>

            {/* BILLING */}
            <GlassSection title="Billing Address">
              <p>{selectedOrder.billingAddress.name}</p>
            </GlassSection>

            {/* PAYMENT */}
            <GlassSection title="Payment Info">
              <p>Method: {selectedOrder.paymentMethod}</p>
              <p>Status: {selectedOrder.paymentStatus}</p>
              <p>Total: ₹{selectedOrder.total}</p>
            </GlassSection>

            {/* ITEMS */}
            <h3 className="text-xl font-semibold mt-4 mb-3 text-gray-800">
              Items
            </h3>

            <div className="space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border rounded-xl bg-white/70 shadow"
                >
                  <img
                    src={item.productImage}
                    className="w-20 h-20 object-cover rounded-xl shadow"
                  />
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.priceAtPurchase}</p>
                    <p>Total: ₹{item.itemTotal}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-6">
              <button
                className="px-6 py-3 rounded-xl text-white font-semibold shadow-md"
                style={{ background: BRAND }}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------- Glass Section Component ----------------------- */

const GlassSection = ({ title, children }) => (
  <div
    className="p-4 rounded-xl shadow mb-4 border"
    style={{
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(10px)",
      borderColor: "rgba(255,255,255,0.3)",
    }}
  >
    <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
    <div className="text-gray-700">{children}</div>
  </div>
);
