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

  // Always ensure vouchers is an array to prevent .map crash
  const safeVouchers = Array.isArray(vouchers) ? vouchers : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    amount: "",
    minimumValue: "",
    startFrom: "",
    validUpto: "",
  });

  // Load vouchers from backend
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Vouchers</h1>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#ce8b5b] text-white px-4 py-2 rounded-lg hover:bg-[#cd712f] shadow-sm transition"
        >
          <PlusCircle size={20} /> Create Voucher
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Min Value</th>
              <th className="p-3">Start</th>
              <th className="p-3">Valid Upto</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-5 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && safeVouchers.length === 0 && (
              <tr>
                <td colSpan="7" className="p-5 text-center text-gray-500">
                  No vouchers available
                </td>
              </tr>
            )}

            {!loading &&
              safeVouchers.map((v) => (
                <tr key={v._id} className="border-b">
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.code}</td>
                  <td className="p-3">₹{v.amount}</td>
                  <td className="p-3">₹{v.minimumValue}</td>
                  <td className="p-3">
                    {new Date(v.startFrom).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {new Date(v.validUpto).toLocaleString()}
                  </td>

                  <td className="p-3 flex justify-center gap-4 text-center">
                    <button
                      onClick={() => openEditModal(v)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteVoucher(v._id)}
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

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              {editingVoucher ? "Update Voucher" : "Create Voucher"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block font-medium mb-1">Voucher Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              {/* Code */}
              <div>
                <label className="block font-medium mb-1">Voucher Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>

              {/* Amount & Min Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    name="minimumValue"
                    value={formData.minimumValue}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Start From</label>
                  <input
                    type="datetime-local"
                    name="startFrom"
                    value={formData.startFrom}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Valid Upto</label>
                  <input
                    type="datetime-local"
                    name="validUpto"
                    value={formData.validUpto}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ce8b5b] text-white rounded-lg hover:bg-[#cd712f] transition"
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
