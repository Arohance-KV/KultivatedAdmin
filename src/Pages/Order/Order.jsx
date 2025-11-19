import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, Printer, Truck, PackageCheck } from "lucide-react";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load Orders from LocalStorage (initial load)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
    setFilteredOrders(saved);
  }, []);

  // Save Orders to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
    applyFilters();
  }, [orders]);

  // Apply search + status filters
  useEffect(() => {
    applyFilters();
  }, [search, statusFilter]);

  function applyFilters() {
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
  }

  // Update order status
  const updateStatus = (orderId) => {
    const updated = orders.map((o) => {
      if (o._id === orderId) {
        let nextStatus =
          o.status === "pending"
            ? "shipped"
            : o.status === "shipped"
            ? "delivered"
            : o.status;

        return { ...o, status: nextStatus };
      }
      return o;
    });

    setOrders(updated);
  };

  // View order detail modal
  const viewOrder = (order) => {
    setSelectedOrder(order);
  };

  // Generate Printable Invoice
  const printInvoice = () => {
    const invoiceWindow = window.open("", "PRINT", "height=600,width=800");

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${selectedOrder.orderNumber}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ccc; padding: 8px; }
            .section { margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Invoice - ${selectedOrder.orderNumber}</h2>

          <div class="section">
            <h3>Shipping Address</h3>
            <p>${selectedOrder.shippingAddress.name}</p>
            <p>${selectedOrder.shippingAddress.addressLine1}, ${
      selectedOrder.shippingAddress.city
    }</p>
            <p>${selectedOrder.shippingAddress.state} - ${
      selectedOrder.shippingAddress.pinCode
    }</p>
            <p>${selectedOrder.shippingAddress.country}</p>
            <p>${selectedOrder.shippingAddress.phone}</p>
          </div>

          <div class="section">
            <h3>Payment Info</h3>
            <p>Method: ${selectedOrder.paymentMethod}</p>
            <p>Status: ${selectedOrder.paymentStatus}</p>
            <p>Subtotal: ₹${selectedOrder.subtotal}</p>
            <p>Discount: ₹${selectedOrder.totalDiscountAmount}</p>
            <p>Tax: ₹${selectedOrder.taxAmount}</p>
            <p>Shipping: ₹${selectedOrder.shippingCharge}</p>
            <p><strong>Total: ₹${selectedOrder.total}</strong></p>
          </div>

          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
              ${selectedOrder.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.priceAtPurchase}</td>
                  <td>₹${item.itemTotal}</td>
                </tr>
              `
                )
                .join("")}
              </tbody>
            </table>
          </div>

          <script>
            window.print();
          </script>
        </body>
      </html>
    `);

    invoiceWindow.document.close();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

        {/* Search */}
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

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            className="border px-4 py-2 rounded-lg bg-white shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
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
                      onClick={() => viewOrder(o)}
                    >
                      <Eye size={20} />
                    </button>

                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => updateStatus(o._id)}
                    >
                      {o.status === "pending" && <Truck size={20} />}
                      {o.status === "shipped" && <PackageCheck size={20} />}
                    </button>

                    <button
                      className="text-gray-700 hover:text-black"
                      onClick={printInvoice}
                    >
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

            {/* SHIPPING ADDRESS */}
            <div className="bg-gray-100 p-4 rounded mb-3">
              <h3 className="font-semibold mb-1">Shipping Address</h3>
              <p>{selectedOrder.shippingAddress.name}</p>
              <p>{selectedOrder.shippingAddress.addressLine1}</p>
              <p>
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state}
              </p>
              <p>{selectedOrder.shippingAddress.country}</p>
            </div>

            {/* BILLING */}
            <div className="bg-gray-100 p-4 rounded mb-3">
              <h3 className="font-semibold mb-1">Billing Address</h3>
              <p>{selectedOrder.billingAddress.name}</p>
              <p>{selectedOrder.billingAddress.addressLine1}</p>
            </div>

            {/* PAYMENT INFO */}
            <div className="bg-gray-100 p-4 rounded mb-3">
              <h3 className="font-semibold mb-2">Payment Info</h3>
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
