import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../../redux/DiscountSlice"; // ⬅️ adjust path if needed

import { Pencil, Trash2, PlusCircle } from "lucide-react";

const initialFormState = {
  code: "",
  type: "coupon",
  discountType: "percentage",
  value: "",
  minPurchase: "",
  validUntil: "",
  usageLimit: "",
  isActive: true,
};

export default function Discount() {
  const dispatch = useDispatch();

  const { discounts, loading, error } = useSelector((state) => state.discount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialFormState);

  // Load all discounts on mount
  useEffect(() => {
    dispatch(getAllDiscounts());
  }, [dispatch]);

  // Open create modal
  const openAddModal = () => {
    setForm(initialFormState);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      ...item,
      // Convert ISO date to yyyy-MM-dd for date input
      validUntil: item.validUntil ? item.validUntil.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create or update discount
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update
      dispatch(updateDiscount({ id: editingItem._id, formData: form })).then(
        (res) => {
          if (!res.error) {
            setIsModalOpen(false);
          }
        }
      );
    } else {
      // Create
      dispatch(createDiscount(form)).then((res) => {
        if (!res.error) {
          setIsModalOpen(false);
        }
      });
    }
  };

  // Delete discount
  const handleDelete = (id) => {
    if (window.confirm("Delete this discount?")) {
      dispatch(deleteDiscount(id));
    }
  };

  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage Discounts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit and manage your discount codes.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#ce8b5b] text-white px-4 py-2.5 rounded-lg hover:bg-[#cd712f] shadow-sm transition"
        >
          <PlusCircle size={20} />
          <span className="font-medium text-sm">Add Discount</span>
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
          {typeof error === "string"
            ? error
            : error?.message || "Something went wrong."}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden bg-white rounded-xl shadow-md border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-700 font-medium text-sm">
              <th className="p-4">Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Value</th>
              <th className="p-4">Min Purchase</th>
              <th className="p-4">Valid Until</th>
              <th className="p-4">Usage Limit</th>
              <th className="p-4">Active</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">
                  Loading discounts...
                </td>
              </tr>
            )}

            {!loading && discounts.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">
                  No discount codes found
                </td>
              </tr>
            )}

            {discounts.map((d) => (
              <tr
                key={d._id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition-all"
              >
                <td className="p-4 font-semibold text-gray-800">{d.code}</td>
                <td className="p-4 text-gray-700 text-sm">{d.type}</td>
                <td className="p-4 text-gray-700 text-sm">
                  {d.discountType}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {d.discountType === "percentage"
                    ? `${d.value}%`
                    : `₹${d.value}`}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  ₹{d.minPurchase}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {d.validUntil
                    ? new Date(d.validUntil).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {d.usageLimit || "—"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      d.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(d)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(d._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {editingItem ? "Edit Discount" : "Create Discount"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* CODE */}
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Discount Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* TYPE + DISCOUNT TYPE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                  >
                    <option value="coupon">Coupon</option>
                    <option value="offer">Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
              </div>

              {/* VALUE + MIN PURCHASE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Value
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Minimum Purchase
                  </label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={form.minPurchase}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* VALID UNTIL */}
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={form.validUntil}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                  required
                />
              </div>

              {/* USAGE LIMIT */}
              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Usage Limit (Optional)
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg"
                />
              </div>

              {/* ACTIVE */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="font-medium text-gray-700">Active</label>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ce8b5b] text-white rounded-lg shadow hover:bg-[#cd712f] transition"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
