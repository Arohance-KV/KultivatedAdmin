import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../../redux/DiscountSlice";

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

  const BRAND = "#c28356";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialFormState);

  // Load discounts
  useEffect(() => {
    dispatch(getAllDiscounts());
  }, [dispatch]);

  const openAddModal = () => {
    setForm(initialFormState);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      ...item,
      validUntil: item.validUntil ? item.validUntil.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      dispatch(updateDiscount({ id: editingItem._id, formData: form })).then(
        (res) => !res.error && setIsModalOpen(false)
      );
    } else {
      dispatch(createDiscount(form)).then(
        (res) => !res.error && setIsModalOpen(false)
      );
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this discount code?")) {
      dispatch(deleteDiscount(id));
    }
  };

  return (
    <div
      className="p-8"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#c28356] tracking-wide drop-shadow-sm">
            Manage Discounts
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create, edit and manage discount codes.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-all"
          style={{ background: BRAND }}
        >
          <PlusCircle size={20} /> Add Discount
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 shadow-sm">
          {typeof error === "string" ? error : error?.message}
        </div>
      )}

      {/* TABLE WRAPPER */}
      <div
        className="rounded-2xl shadow-xl border overflow-x-auto"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(255,255,255,0.35)",
        }}
      >
        <table className="w-full text-left">
          <thead
            className="text-gray-700 text-sm"
            style={{ background: "rgba(255,255,255,0.45)" }}
          >
            <tr>
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
                <td className="p-6 text-center text-gray-500" colSpan="9">
                  Loading discounts...
                </td>
              </tr>
            )}

            {!loading && discounts?.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500 italic" colSpan="9">
                  No discount codes found
                </td>
              </tr>
            )}

            {discounts?.map((d) => (
              <tr
                key={d._id}
                className="border-t hover:bg-white/40 transition"
              >
                <td className="p-4 font-semibold text-gray-800">{d.code}</td>
                <td className="p-4 capitalize text-gray-700">{d.type}</td>
                <td className="p-4 capitalize text-gray-700">
                  {d.discountType}
                </td>
                <td className="p-4 font-medium text-gray-900">
                  {d.discountType === "percentage"
                    ? `${d.value}%`
                    : `₹${d.value}`}
                </td>
                <td className="p-4 text-gray-700">₹{d.minPurchase}</td>
                <td className="p-4 text-gray-700">
                  {d.validUntil
                    ? new Date(d.validUntil).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-4 text-gray-700">
                  {d.usageLimit || "Unlimited"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      d.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-3 justify-center">
                    <button
                      className="p-2 rounded-lg bg-white/60 shadow hover:shadow-md text-[#c28356]"
                      onClick={() => openEditModal(d)}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="p-2 rounded-lg bg-red-50 text-red-600 shadow hover:bg-red-100"
                      onClick={() => handleDelete(d._id)}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div
            className="w-full max-w-xl rounded-2xl p-7 shadow-2xl border relative"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(14px)",
              borderColor: "rgba(255,255,255,0.4)",
            }}
          >
            <h2 className="text-2xl font-semibold text-[#c28356] mb-6">
              {editingItem ? "Edit Discount" : "Create Discount"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Code */}
              <GlassInput
                label="Discount Code"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
              />

              {/* Type + Discount Type */}
              <div className="grid grid-cols-2 gap-4">
                <GlassSelect
                  label="Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  options={[
                    { value: "coupon", label: "Coupon" },
                    { value: "offer", label: "Offer" },
                  ]}
                />

                <GlassSelect
                  label="Discount Type"
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "flat", label: "Flat Amount" },
                  ]}
                />
              </div>

              {/* Value + Min Purchase */}
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Value"
                  name="value"
                  type="number"
                  value={form.value}
                  onChange={handleChange}
                  required
                />
                <GlassInput
                  label="Minimum Purchase"
                  name="minPurchase"
                  type="number"
                  value={form.minPurchase}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Valid Until */}
              <GlassInput
                label="Valid Until"
                type="date"
                name="validUntil"
                value={form.validUntil}
                onChange={handleChange}
                required
              />

              {/* Usage Limit */}
              <GlassInput
                label="Usage Limit (Optional)"
                name="usageLimit"
                type="number"
                value={form.usageLimit}
                onChange={handleChange}
              />

              {/* Active */}
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                Active
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{ background: BRAND }}
                  className="px-6 py-2 rounded-lg text-white shadow-md"
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

/* ----------------------- Glass Input Components ----------------------- */

const GlassInput = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 rounded-xl border bg-white/60 shadow-sm focus:ring-2 focus:ring-[#c28356] outline-none"
    />
  </div>
);

const GlassSelect = ({ label, options, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-2 rounded-xl border bg-white/60 shadow-sm focus:ring-2 focus:ring-[#c28356] outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
