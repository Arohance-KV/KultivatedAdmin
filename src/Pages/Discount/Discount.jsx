import React, { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    code: "",
    type: "coupon",
    discountType: "percentage",
    value: "",
    minPurchase: "",
    validUntil: "",
    usageLimit: "",
    isActive: true,
  });

  // Load from LocalStorage on start
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("discounts")) || [];
    setDiscounts(saved);
  }, []);

  // Save to LocalStorage on update
  useEffect(() => {
    localStorage.setItem("discounts", JSON.stringify(discounts));
  }, [discounts]);

  const openAddModal = () => {
    setForm({
      code: "",
      type: "coupon",
      discountType: "percentage",
      value: "",
      minPurchase: "",
      validUntil: "",
      usageLimit: "",
      isActive: true,
    });
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setForm(discounts[index]);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingIndex !== null) {
      // Update existing discount
      const updated = [...discounts];
      updated[editingIndex] = form;
      setDiscounts(updated);
    } else {
      // Add new discount
      setDiscounts([...discounts, form]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    if (confirm("Delete this discount code?")) {
      setDiscounts(discounts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Discount Codes</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Add Discount
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Value</th>
              <th className="p-3">Min Purchase</th>
              <th className="p-3">Valid Until</th>
              <th className="p-3">Usage Limit</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {discounts.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-5 text-gray-500">
                  No discount codes found
                </td>
              </tr>
            )}

            {discounts.map((d, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{d.code}</td>
                <td className="p-3">{d.type}</td>
                <td className="p-3">{d.discountType}</td>
                <td className="p-3">{d.value}</td>
                <td className="p-3">{d.minPurchase}</td>
                <td className="p-3">
                  {new Date(d.validUntil).toLocaleDateString()}
                </td>
                <td className="p-3">{d.usageLimit || "—"}</td>
                <td className="p-3">{d.isActive ? "Yes" : "No"}</td>

                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => openEditModal(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg animate-fadeIn">

            <h2 className="text-xl font-semibold mb-4">
              {editingIndex !== null ? "Edit Discount" : "Create Discount"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* CODE */}
              <div>
                <label className="block font-medium mb-1">Discount Code</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="block font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="coupon">Coupon</option>
                  <option value="offer">Offer</option>
                </select>
              </div>

              {/* DISCOUNT TYPE */}
              <div>
                <label className="block font-medium mb-1">Discount Type</label>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat Amount</option>
                </select>
              </div>

              {/* VALUE */}
              <div>
                <label className="block font-medium mb-1">Discount Value</label>
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* MIN PURCHASE */}
              <div>
                <label className="block font-medium mb-1">Minimum Purchase</label>
                <input
                  type="number"
                  name="minPurchase"
                  value={form.minPurchase}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* VALID UNTIL */}
              <div>
                <label className="block font-medium mb-1">Valid Until</label>
                <input
                  type="date"
                  name="validUntil"
                  value={form.validUntil}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* USAGE LIMIT */}
              <div>
                <label className="block font-medium mb-1">Usage Limit (Optional)</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* ACTIVE */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <label className="font-medium">Active</label>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-4 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingIndex !== null ? "Update" : "Create"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
