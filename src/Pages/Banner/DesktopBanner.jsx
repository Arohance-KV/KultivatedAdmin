import React, { useState, useEffect } from 'react';
import {
  Upload, X, Image, Check, Plus, Monitor, Edit2, Trash2, Eye,
  LayoutGrid, List
} from 'lucide-react';

// ===== Redux Imports =====
import { useDispatch, useSelector } from "react-redux";
import {
  createDesktopBanner,
  getAllDesktopBanners,
  deleteDesktopBanner,
  updateDesktopBanner
} from "../../redux/DesktopBannerSlice";

export default function DesktopBannerManagement() {
  const dispatch = useDispatch();

  // ===== GLOBAL STATE =====
  const { banners, loading } = useSelector((state) => state.desktopBanner);

  const [showForm, setShowForm] = useState(false);

  // NEW: ADD LINK FIELD
  const [bannerLink, setBannerLink] = useState("");

  const [bannerName, setBannerName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // EDIT modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // ================== GET ALL BANNERS ==================
  useEffect(() => {
    dispatch(getAllDesktopBanners());
  }, [dispatch]);

  // ================== FILE UPLOAD ==================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ================== ADD NEW BANNER ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerName.trim()) return alert("Enter banner name");
    if (!bannerLink.trim()) return alert("Enter banner link");
    if (!imagePreview) return alert("Select image");

    const payload = {
      name: bannerName,
      link: bannerLink,
      imageUrl: imagePreview,
    };

    const res = await dispatch(createDesktopBanner(payload));

    if (res.meta.requestStatus === "fulfilled") {
      setSuccessMessage("Banner uploaded successfully!");
      setTimeout(() => {
        setBannerName("");
        setBannerLink("");
        setImageFile(null);
        setImagePreview(null);
        setShowForm(false);
        setSuccessMessage("");
      }, 1500);
    }
  };

  // ================== DELETE ==================
  const handleDelete = (id) => {
    if (window.confirm("Delete this banner?")) {
      dispatch(deleteDesktopBanner(id));
    }
  };

  // ================== OPEN EDIT MODAL ==================
  const openEditModal = (banner) => {
    setEditBanner(banner);
    setEditName(banner.name);
    setEditLink(banner.link); // NEW
    setEditImagePreview(banner.imageUrl);
    setEditImageFile(null);
    setIsEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ================== SAVE EDITED ==================
  const saveEditedBanner = async () => {
    if (!editBanner) return;

    const payload = {
      id: editBanner._id,
      updates: {
        name: editName,
        link: editLink, // NEW
        imageUrl: editImagePreview,
      },
    };

    const res = await dispatch(updateDesktopBanner(payload));
    if (res.meta.requestStatus === "fulfilled") {
      setIsEditOpen(false);
    }
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Desktop Banner Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your desktop website banners with style
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:shadow-lg hover:scale-105 transition"
            >
              <Plus className="w-5 h-5" /> Add Banner
            </button>
          </div>
        </div>

        {/* ADD NEW BANNER FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-blue-200">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Upload Desktop Banner
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-6 h-6 text-slate-500 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-6">

              {/* NAME */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Name *</label>
                <input
                  className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg"
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  placeholder="Enter banner name"
                />
              </div>

              {/* NEW FIELD: LINK */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Link *</label>
                <input
                  className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg"
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Image *</label>

                {!imagePreview ? (
                  <label className="w-full border-2 border-dashed border-slate-300 p-8 text-center rounded-lg cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600 font-medium">Click to upload</p>
                  </label>
                ) : (
                  <div className="relative border-2 border-slate-200 rounded-lg p-4">
                    <img src={imagePreview} className="w-full h-64 object-cover rounded-lg" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* SUCCESS */}
              {successMessage && (
                <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 px-6 text-white font-semibold rounded-lg bg-blue-600"
              >
                {loading ? "Saving..." : "Upload Banner"}
              </button>

            </div>

          </div>
        )}

        {/* BANNERS LIST */}
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <Monitor className="w-16 h-16 mx-auto text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-800 mt-4">
              No desktop banners yet
            </h3>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* IMAGE */}
                <div className="h-48 relative">
                  <img src={banner.imageUrl} className="w-full h-full object-cover" />
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{banner.name}</h3>

                  <p className="text-sm text-blue-600 underline mb-3 break-all">
                    {banner.link}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-100 py-2 rounded-lg">
                      <Eye className="inline-block w-4 h-4 mr-1" />
                      View
                    </button>

                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 bg-yellow-100 py-2 rounded-lg"
                    >
                      <Edit2 className="inline-block w-4 h-4 mr-1" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bg-red-100 px-4 py-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Edit Banner</h2>
              <button onClick={() => setIsEditOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* NAME */}
            <div className="mb-4">
              <label className="font-semibold">Banner Name *</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* NEW FIELD: LINK */}
            <div className="mb-4">
              <label className="font-semibold">Banner Link *</label>
              <input
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* IMAGE */}
            <div className="mb-3">
              <label className="font-semibold">Banner Image *</label>
              <input type="file" accept="image/*" onChange={handleEditImageChange} className="mt-2" />

              {editImagePreview && (
                <img src={editImagePreview} className="w-full h-56 mt-3 object-cover rounded-lg" />
              )}
            </div>

            <button
              onClick={saveEditedBanner}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
