import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Truck,
  PackageCheck,
  Printer,
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

  const [filteredOrders, setFilteredOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  // LOAD ORDERS FROM API
  useEffect(() => {
    dispatch(fetchAllOrders({ page: 1, limit: 50 }));
  }, [dispatch]);

  // FILTER WHEN ORDERS CHANGE
  useEffect(() => {
    setFilteredOrders(orders || []);
  }, [orders]);

  // APPLY FILTERS
  useEffect(() => {
    let data = [...orders];

    if (search.trim() !== "") {
      data = data.filter((o) =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(data);
  }, [search, statusFilter, orders]);

  // UPDATE ORDER STATUS USING API
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

  // OPEN MODAL WITH FULL API DATA
  const openOrderDetails = (order) => {
    dispatch(fetchOrderById(order._id)).then((res) => {
      setSelectedOrder(res.payload);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#c46c39] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/3 bg-white shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search Order Number..."
            className="ml-2 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            className="border px-4 py-2 rounded-lg bg-white shadow-sm"
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

      {/* ORDER TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Order Number</th>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((o, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{o.orderNumber}</td>
                  <td className="p-3">{o.user}</td>
                  <td className="p-3 capitalize">{o.status}</td>
                  <td className="p-3">₹{o.total}</td>
                  <td className="p-3">{o.paymentStatus}</td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openOrderDetails(o)}
                    >
                      <Eye size={20} />
                    </button>

                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleStatusUpdate(o)}
                    >
                      {o.status === "pending" && <Truck size={20} />}
                      {o.status === "processing" && <Truck size={20} />}
                      {o.status === "shipped" && <PackageCheck size={20} />}
                    </button>

                    <button className="text-gray-700 hover:text-black">
                      <Printer size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg overflow-y-auto max-h-[85vh]">
            <h2 className="text-xl font-semibold mb-4">
              Order Details — {selectedOrder.orderNumber}
            </h2>

            {/* SHIPPING */}
            <div className="bg-gray-100 p-4 rounded mb-3">
              <h3 className="font-semibold mb-1">Shipping Address</h3>
              <p>{selectedOrder.shippingAddress.name}</p>
              <p>{selectedOrder.shippingAddress.addressLine1}</p>
              <p>
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state}
              </p>
            </div>

            {/* BILLING */}
            <div className="bg-gray-100 p-4 rounded mb-3">
              <h3 className="font-semibold mb-1">Billing Address</h3>
              <p>{selectedOrder.billingAddress.name}</p>
            </div>

            {/* PAYMENT */}
            <div className="bg-gray-100 p-4 rounded mb-3">
              <h3 className="font-semibold">Payment Info</h3>
              <p>Method: {selectedOrder.paymentMethod}</p>
              <p>Status: {selectedOrder.paymentStatus}</p>
              <p>Total: ₹{selectedOrder.total}</p>
            </div>

            {/* ITEMS */}
            <h3 className="font-semibold mt-4 mb-2">Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="p-3 border rounded flex gap-4">
                  <img
                    src={item.productImage}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.priceAtPurchase}</p>
                    <p>Total: ₹{item.itemTotal}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-6">
              <button
                className="px-5 py-2 bg-gray-700 text-white rounded-lg"
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
