import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllVouchers,
} from "../../redux/VoucherSlice";

export default function Voucher() {
  const dispatch = useDispatch();
  const { vouchers, loading } = useSelector((state) => state.voucher);

  const safeVouchers = Array.isArray(vouchers) ? vouchers : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const BRAND = "#c28356";

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    amount: "",
    minimumValue: "",
    startFrom: "",
    validUpto: "",
  });

  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingVoucher(null);
    setFormData({
      name: "",
      code: "",
      amount: "",
      minimumValue: "",
      startFrom: "",
      validUpto: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      ...voucher,
      startFrom: voucher.startFrom?.slice(0, 16),
      validUpto: voucher.validUpto?.slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingVoucher) {
      await dispatch(updateVoucher({ id: editingVoucher._id, data: formData }));
    } else {
      await dispatch(createVoucher(formData));
    }

    setIsModalOpen(false);
    dispatch(getAllVouchers());
  };

  const handleDeleteVoucher = async (id) => {
    if (confirm("Are you sure want to delete this voucher?")) {
      await dispatch(deleteVoucher(id));
      dispatch(getAllVouchers());
    }
  };

  return (
    <div
      className="p-8"
      style={{
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* HEADER — GLASS */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#c28356] drop-shadow-sm tracking-wide">
          Manage Vouchers
        </h1>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md transition"
          style={{
            background: BRAND,
            backdropFilter: "blur(8px)",
          }}
        >
          <PlusCircle size={20} /> Create Voucher
        </button>
      </div>

      {/* TABLE WRAPPER — GLASS */}
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
            className="text-gray-700"
            style={{ background: "rgba(255,255,255,0.45)" }}
          >
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Min Value</th>
              <th className="p-4">Start</th>
              <th className="p-4">Valid Upto</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-600">
                  Loading vouchers...
                </td>
              </tr>
            )}

            {!loading && safeVouchers.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500 italic"
                >
                  No vouchers available
                </td>
              </tr>
            )}

            {!loading &&
              safeVouchers.map((v) => (
                <tr
                  key={v._id}
                  className="border-t hover:bg-white/40 transition"
                >
                  <td className="p-4 font-medium">{v.name}</td>
                  <td className="p-4">{v.code}</td>
                  <td className="p-4">₹{v.amount}</td>
                  <td className="p-4">₹{v.minimumValue}</td>
                  <td className="p-4">
                    {new Date(v.startFrom).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {new Date(v.validUpto).toLocaleString()}
                  </td>

                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => openEditModal(v)}
                      className="text-[#c28356] hover:scale-110 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteVoucher(v._id)}
                      className="text-red-600 hover:scale-110 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL — GLASS PREMIUM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div
            className="relative w-full max-w-lg p-7 rounded-2xl shadow-2xl border"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(14px)",
              borderColor: "rgba(255,255,255,0.4)",
            }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-[#c28356]">
              {editingVoucher ? "Update Voucher" : "Create Voucher"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <GlassInput
                label="Voucher Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              {/* Code */}
              <GlassInput
                label="Voucher Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
              />

              {/* Amount & Minimum */}
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                />
                <GlassInput
                  label="Minimum Value"
                  name="minimumValue"
                  type="number"
                  value={formData.minimumValue}
                  onChange={handleChange}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Start From"
                  type="datetime-local"
                  name="startFrom"
                  value={formData.startFrom}
                  onChange={handleChange}
                />
                <GlassInput
                  label="Valid Upto"
                  type="datetime-local"
                  name="validUpto"
                  value={formData.validUpto}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white font-semibold shadow-md transition"
                  style={{ background: BRAND }}
                >
                  {editingVoucher ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------- GLASS INPUT COMPONENT ---------------------- */

const GlassInput = ({ label, ...props }) => {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 border rounded-xl bg-white/60 shadow-sm focus:ring-2 focus:ring-[#c28356] outline-none"
      />
    </div>
  );
};
