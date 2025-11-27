import React, { useState, useEffect } from 'react';
import {
  Upload, X, Check, Plus, Monitor, Edit2, Trash2, Eye,
  AlertCircle, CheckCircle, Loader, LayoutGrid
} from 'lucide-react';

// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import {
  createDesktopBanner,
  getAllDesktopBanners,
  deleteDesktopBanner,
  updateDesktopBanner
} from "../../redux/DesktopBannerSlice";
import { uploadImageAsync, clearUploadedImages } from "../../redux/UploadImgSlice";

export default function DesktopBannerManagement() {
  const dispatch = useDispatch();
  
  // Redux state with defaults
  const desktopBannerState = useSelector((state) => state.desktopBanner);
  const uploadState = useSelector((state) => state.upload);

  const { 
    banners = [], 
    loading = false,
    error = null,
  } = desktopBannerState || {};

  const { 
    loading: uploadLoading = false, 
    error: uploadError = null 
  } = uploadState || {};

  const brandColor = "#c46c39";
  const brandColorLight = "#f0e6dc";
  

  // States
  const [showForm, setShowForm] = useState(false);
  const [bannerName, setBannerName] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Edit modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getAllDesktopBanners());
  }, [dispatch]);

  // File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerName?.trim()) return alert("Enter banner name");
    if (!bannerLink?.trim()) return alert("Enter banner link");
    if (!imagePreview) return alert("Select image");

    try {
      if (imageFile) {
        const uploadRes = await dispatch(uploadImageAsync(imageFile));
        
        if (uploadRes.meta.requestStatus === "fulfilled") {
          const uploadedImageUrl = uploadRes.payload?.[0] || imagePreview;

          const payload = {
            name: bannerName,
            link: bannerLink,
            imageUrl: uploadedImageUrl,
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
              dispatch(clearUploadedImages());
            }, 1500);
          } else {
            alert("Failed to create banner. Please try again.");
          }
        } else {
          alert("Failed to upload image. Please try again.");
        }
      }
    } catch (error) {
      alert("Error uploading banner. Please try again.");
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this banner?")) {
      dispatch(deleteDesktopBanner(id));
    }
  };

  const openEditModal = (banner) => {
    setEditBanner(banner);
    setEditName(banner.name);
    setEditLink(banner.link);
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

  const saveEditedBanner = async () => {
    if (!editBanner) return;
    if (!editName?.trim()) return alert("Enter banner name");
    if (!editLink?.trim()) return alert("Enter banner link");
    if (!editImagePreview) return alert("Select image");

    try {
      let finalImageUrl = editImagePreview;

      if (editImageFile) {
        const uploadRes = await dispatch(uploadImageAsync(editImageFile));
        
        if (uploadRes.meta.requestStatus === "fulfilled") {
          finalImageUrl = uploadRes.payload?.[0] || editImagePreview;
        } else {
          alert("Failed to upload image. Please try again.");
          return;
        }
      }

      const payload = {
        id: editBanner._id,
        updates: {
          name: editName,
          link: editLink,
          imageUrl: finalImageUrl,
        },
      };

      const res = await dispatch(updateDesktopBanner(payload));
      if (res.meta.requestStatus === "fulfilled") {
        setIsEditOpen(false);
        dispatch(clearUploadedImages());
      } else {
        alert("Failed to update banner. Please try again.");
      }
    } catch (error) {
      alert("Error updating banner. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#f9f6f2" }}>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold mb-2" style={{ color: brandColor }}>
                Desktop Banner Management
              </h1>
              <p className="text-gray-600 text-lg">Create, edit, and manage promotional banners for your desktop platform</p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              style={{ backgroundColor: brandColor }}
              className="text-white px-8 py-3 rounded-xl flex items-center gap-2 font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Add Banner
            </button>
          </div>
        </div>

        {/* STATS CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4" style={{ borderColor: brandColor }}>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: brandColorLight }}>
              <Monitor className="w-8 h-8" style={{ color: brandColor }} />
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">Total Desktop Banners</p>
              <p className="text-4xl font-bold" style={{ color: brandColor }}>{banners.length}</p>
            </div>
          </div>
        </div>

        {/* ADD BANNER FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4" style={{ borderColor: brandColor }}>
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ color: brandColor }}>
                Upload Desktop Banner
              </h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* NAME */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: brandColor }}>
                  Banner Name *
                </label>
                <input
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  onFocus={(e) => e.target.style.borderColor = brandColor}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  placeholder="Enter banner name"
                />
              </div>

              {/* LINK */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: brandColor }}>
                  Banner Link *
                </label>
                <input
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  onFocus={(e) => e.target.style.borderColor = brandColor}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  placeholder="https://example.com"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: brandColor }}>
                  Banner Image *
                </label>
                {!imagePreview ? (
                  <label className="block border-2 border-dashed border-gray-300 p-8 text-center rounded-xl cursor-pointer hover:bg-opacity-50 transition" style={{ backgroundColor: brandColorLight }}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                    <Upload className="w-12 h-12 mx-auto mb-2" style={{ color: brandColor }} />
                    <p className="font-medium" style={{ color: brandColor }}>
                      Click to upload banner image
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, AVIF up to 10MB</p>
                  </label>
                ) : (
                  <div className="relative border-2 border-gray-200 p-4 rounded-xl">
                    <img src={imagePreview} className="w-full h-64 object-cover rounded-lg" alt="Preview" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* ERROR MESSAGES */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex shrink-0 mt-0.5" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex shrink-0 mt-0.5" />
                  <span className="text-red-700">{uploadError}</span>
                </div>
              )}

              {/* SUCCESS MESSAGE */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex gap-3 items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 flex shrink-0" />
                  <span className="text-green-700">{successMessage}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={loading || uploadLoading}
                style={{ backgroundColor: brandColor }}
                className="w-full py-3 px-6 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading || uploadLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Upload Banner"
                )}
              </button>
            </div>
          </div>
        )}

        {/* BANNER LIST */}
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <Monitor className="w-16 h-16 mx-auto mb-4" style={{ color: brandColor }} />
            <h3 className="text-2xl font-bold mt-4" style={{ color: brandColor }}>
              No desktop banners yet
            </h3>
            <p className="text-gray-600 mt-2">Click "Add Banner" to upload your first banner</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <div 
                key={banner._id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 group"
                style={{ borderColor: brandColor }}
              >
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={banner.imageUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt={banner.name}
                  />
                  <div 
                    className="absolute top-3 right-3 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 font-semibold"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Monitor className="w-3 h-3" /> Desktop
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 truncate" style={{ color: brandColor }}>
                    {banner.name}
                  </h3>

                  <p 
                    className="text-sm mb-3 break-all hover:underline cursor-pointer"
                    style={{ color: brandColor }}
                  >
                    {banner.link}
                  </p>

                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p>Created: {new Date(banner.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className="flex-1 border-2 border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium"
                      style={{ color: brandColor }}
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>

                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 border-2 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium hover:shadow-md"
                      style={{ borderColor: brandColor, color: brandColor, backgroundColor: brandColorLight }}
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition font-medium hover:shadow-md"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border-l-4" style={{ borderColor: brandColor }}>
            
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: brandColor }}>
                Edit Desktop Banner
              </h2>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              {/* NAME */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: brandColor }}>
                  Banner Name *
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  onFocus={(e) => e.target.style.borderColor = brandColor}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* LINK */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: brandColor }}>
                  Banner Link *
                </label>
                <input
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  onFocus={(e) => e.target.style.borderColor = brandColor}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: brandColor }}>
                  Banner Image *
                </label>

                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-opacity-50 transition" style={{ backgroundColor: brandColorLight }}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  <Upload className="w-10 h-10 mx-auto" style={{ color: brandColor }} />
                  <p className="mt-2 font-medium" style={{ color: brandColor }}>
                    Click to upload new image
                  </p>
                </label>

                {editImagePreview && (
                  <div className="relative mt-3">
                    <img 
                      src={editImagePreview} 
                      className="w-full h-56 object-cover rounded-lg border-2 border-gray-200" 
                      alt="Edit Preview"
                    />
                    {editImageFile && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                        <span className="text-white font-semibold bg-black bg-opacity-60 px-4 py-2 rounded-lg">
                          New image selected
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex shrink-0 mt-0.5" />
                  <span className="text-red-700">{uploadError}</span>
                </div>
              )}

              <button
                onClick={saveEditedBanner}
                disabled={loading || uploadLoading}
                style={{ backgroundColor: brandColor }}
                className="w-full text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading || uploadLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}