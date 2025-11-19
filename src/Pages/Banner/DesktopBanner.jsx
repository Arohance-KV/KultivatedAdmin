import React, { useState } from 'react';
import { 
  Upload, X, Image, Check, Plus, Monitor, Edit2, Trash2, Eye,
  LayoutGrid, List
} from 'lucide-react';

export default function DesktopBannerManagement() {
  const [showForm, setShowForm] = useState(false);
  const [bannerName, setBannerName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [banners, setBanners] = useState([]);

  const [viewMode, setViewMode] = useState("grid");

  // EDIT modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  // --------------------- UPLOAD HANDLING ---------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else alert('Please select a valid image file');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // --------------------- ADD NEW BANNER ---------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bannerName.trim()) return alert('Enter banner name');
    if (!imageFile) return alert('Select image');

    setIsSubmitting(true);

    setTimeout(() => {
      const newBanner = {
        id: Date.now(),
        name: bannerName,
        image: imagePreview,
        fileName: imageFile.name,
        fileSize: (imageFile.size / 1024).toFixed(2),
        uploadDate: new Date().toLocaleDateString(),
      };

      setBanners([...banners, newBanner]);
      setSuccessMessage('Desktop banner uploaded successfully!');
      setIsSubmitting(false);

      setTimeout(() => {
        setBannerName('');
        setImageFile(null);
        setImagePreview(null);
        setSuccessMessage('');
        setShowForm(false);
      }, 1500);
    }, 1500);
  };

  // --------------------- DELETE BANNER ---------------------
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  // --------------------- EDIT HANDLERS ---------------------
  const openEditModal = (banner) => {
    setEditBannerId(banner.id);
    setEditName(banner.name);
    setEditImage(banner.image);
    setEditImageFile(null);
    setIsEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setEditImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setEditImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveEditedBanner = () => {
    if (!editName.trim()) return alert("Banner name required");

    const updated = banners.map((b) =>
      b.id === editBannerId
        ? {
            ...b,
            name: editName,
            image: editImage,
            fileName: editImageFile ? editImageFile.name : b.fileName,
            fileSize: editImageFile
              ? (editImageFile.size / 1024).toFixed(2)
              : b.fileSize,
          }
        : b
    );

    setBanners(updated);
    setIsEditOpen(false);
  };

  // ----------------------- UI SECTION BELOW --------------------------
 
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Desktop Banner Management</h1>
              <p className="text-slate-600 text-lg">Manage your desktop website banners with style</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:shadow-lg hover:scale-105 transition"
            >
              <Plus className="w-5 h-5" /> Add Banner
            </button>
          </div>
        </div>

        {/* STATS + VIEW SWITCH */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Desktop Banners</p>
                <p className="text-3xl font-bold text-slate-800">{banners.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition
                  ${viewMode === "grid"
                    ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md"
                    : "border-pink-300 text-pink-500 hover:bg-pink-50"}`}
              >
                <LayoutGrid className="w-6 h-6" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition
                  ${viewMode === "list"
                    ? "bg-linear-to-br from-pink-500 to-pink-600 text-white shadow-xl"
                    : "bg-linear-to-br from-pink-200 to-pink-300 text-white opacity-70 hover:opacity-100"}`}
              >
                <List className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>

        {/* ADD BANNER FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-blue-200">

            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Upload Desktop Banner</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">

              {/* NAME */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Name *</label>
                <input
                  className="w-full border-2 border-slate-200 px-4 py-3 rounded-lg focus:border-blue-500"
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  placeholder="Enter desktop banner name"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Image *</label>

                {!imagePreview ? (
                  <label className="w-full border-2 border-dashed border-slate-300 p-8 text-center rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600 font-medium">Click to upload</p>
                  </label>
                ) : (
                  <div className="relative border-2 border-slate-200 rounded-lg p-4">
                    <img src={imagePreview} className="w-full h-64 object-cover rounded-lg" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {successMessage && (
                <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-700 font-medium">{successMessage}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-3 px-6 text-white font-semibold rounded-lg transition ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? "Uploading..." : "Upload Banner"}
              </button>

            </div>

          </div>
        )}

        {/* BANNERS LIST */}
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <Monitor className="w-16 h-16 mx-auto text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-800 mt-4">No desktop banners yet</h3>
            <p className="text-slate-600 mt-2">Click “Add Banner” to upload your first banner</p>
          </div>
        ) : (

          <div className={`grid gap-6 transition-all duration-300 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>

            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden
                ${viewMode === "list" ? "flex items-center h-48" : ""}`}
              >
                {/* IMAGE */}
                <div className={`${viewMode === "list" ? "w-48 h-full" : "h-48"} relative`}>
                  <img src={banner.image} className="w-full h-full object-cover" />

                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Monitor className="w-3 h-3" /> Desktop
                  </div>
                </div>

                {/* CONTENT */}
                <div className={`p-5 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className="text-lg font-bold mb-2 truncate">{banner.name}</h3>

                  <div className="space-y-1 text-sm text-slate-600 mb-4">
                    <p className="flex items-center gap-2"><Image className="w-4 h-4" /> {banner.fileName}</p>
                    <p>Size: {banner.fileSize} KB</p>
                    <p>Uploaded: {banner.uploadDate}</p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" /> View
                    </button>

                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn">

            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Edit Banner</h2>
              <button onClick={() => setIsEditOpen(false)}>
                <X className="w-6 h-6 text-slate-500 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-5">

              {/* EDIT NAME */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Name *</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500"
                />
              </div>

              {/* EDIT IMAGE */}
              <div>
                <label className="font-semibold text-slate-700 mb-2 block">Banner Image *</label>

                <label className="block border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  <Upload className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="mt-2 text-slate-500 text-sm">Click to upload new image</p>
                </label>

                <div className="mt-3">
                  <img src={editImage} className="w-full h-56 object-cover rounded-lg border" />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={saveEditedBanner}
                className="w-full py-3 px-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg"
              >
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
