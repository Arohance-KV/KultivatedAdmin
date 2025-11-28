import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Check,
  Plus,
  Monitor,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";

// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import {
  createDesktopBanner,
  getAllDesktopBanners,
  deleteDesktopBanner,
  updateDesktopBanner,
} from "../../redux/DesktopBannerSlice";
import {
  uploadImageAsync,
  clearUploadedImages,
} from "../../redux/UploadImgSlice";

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

  const { loading: uploadLoading = false, error: uploadError = null } =
    uploadState || {};

  const brandColor = "#c46c39";
  const brandColorLight = "#f0e6dc";

  // States
  const [showForm, setShowForm] = useState(false);
  const [bannerName, setBannerName] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [viewMode, setViewMode] = useState("grid");

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
        _id: editBanner._id,
        name: editName,
        link: editLink,
        imageUrl: finalImageUrl,
      };

      const res = await dispatch(updateDesktopBanner(payload));
      if (res.meta.requestStatus === "fulfilled") {
        setIsEditOpen(false);
        setEditBanner(null);
        dispatch(clearUploadedImages());
      } else {
        alert("Failed to update banner. Please try again.");
      }
    } catch (error) {
      alert("Error updating banner. Please try again.");
      console.error(error);
    }
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f6f2" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        {/* GLASS HEADING BAR */}
        <div
          className="flex justify-between items-center mb-8 p-5 rounded-2xl shadow-xl border"
          style={{
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(14px)",
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          {/* Left: Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#c28356] tracking-wide drop-shadow-sm">
            Manage Desktop Banners
          </h1>

          {/* Right: Button */}
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-all"
            style={{
              background: "#c28356",
              backdropFilter: "blur(10px)",
            }}
          >
            + Add Banner
          </button>
        </div>

        {/* STATS + VIEW SWITCH */}
        <div
          className="bg-white rounded-2xl shadow-md p-6 mb-8 flex justify-between items-center border-l-4"
          style={{ borderColor: brandColor }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: brandColorLight }}
            >
              <Monitor className="w-8 h-8" style={{ color: brandColor }} />
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Desktop Banners
              </p>
              <p className="text-4xl font-bold" style={{ color: brandColor }}>
                {banners.length}
              </p>
            </div>
          </div>

          {/* VIEW BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                viewMode === "grid" ? "shadow-lg scale-110" : "hover:scale-105"
              }`}
              style={{
                borderColor: viewMode === "grid" ? brandColor : "#e5e7eb",
                backgroundColor:
                  viewMode === "grid" ? brandColorLight : "transparent",
                color: viewMode === "grid" ? brandColor : "#9ca3af",
              }}
            >
              <LayoutGrid className="w-6 h-6" />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                viewMode === "list" ? "shadow-lg scale-110" : "hover:scale-105"
              }`}
              style={{
                borderColor: viewMode === "list" ? brandColor : "#e5e7eb",
                backgroundColor:
                  viewMode === "list" ? brandColorLight : "transparent",
                color: viewMode === "list" ? brandColor : "#9ca3af",
              }}
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4"
            style={{ borderColor: brandColor }}
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ color: brandColor }}>
                Upload Desktop Banner
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-6">
              {/* NAME */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: brandColor }}
                >
                  Banner Name *
                </label>
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  style={{ focusBorderColor: brandColor }}
                  onFocus={(e) => (e.target.style.borderColor = brandColor)}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  placeholder="Enter desktop banner name"
                />
              </div>

              {/* LINK */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: brandColor }}
                >
                  Banner Link *
                </label>
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  onFocus={(e) => (e.target.style.borderColor = brandColor)}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: brandColor }}
                >
                  Banner Image *
                </label>

                {!imagePreview ? (
                  <label
                    className="block border-2 border-dashed border-gray-300 p-8 text-center rounded-xl cursor-pointer hover:bg-opacity-50 transition"
                    style={{ backgroundColor: brandColorLight }}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Upload
                      className="w-12 h-12 mx-auto mb-2"
                      style={{ color: brandColor }}
                    />
                    <p className="font-medium" style={{ color: brandColor }}>
                      Click to upload banner image
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, AVIF up to 10MB
                    </p>
                  </label>
                ) : (
                  <div className="relative border-2 border-gray-200 p-4 rounded-xl">
                    <img
                      src={imagePreview}
                      className="w-full h-64 object-cover rounded-lg"
                    />
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
            <Monitor
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: brandColor }}
            />
            <h3
              className="text-2xl font-bold mt-4"
              style={{ color: brandColor }}
            >
              No desktop banners yet
            </h3>
            <p className="text-gray-600 mt-2">
              Click "Add Banner" to upload your first banner
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {banners.map((banner) => (
              <div
                key={banner._id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 group
                ${viewMode === "list" ? "flex items-center h-48" : ""}`}
                style={{ borderColor: brandColor }}
              >
                <div
                  className={`${
                    viewMode === "list" ? "w-48 h-full" : "h-48"
                  } relative overflow-hidden`}
                >
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

                <div
                  className={`p-5 ${
                    viewMode === "list"
                      ? "flex-1 flex flex-col justify-between"
                      : ""
                  }`}
                >
                  <div>
                    <h3
                      className="text-lg font-bold mb-2 truncate"
                      style={{ color: brandColor }}
                    >
                      {banner.name}
                    </h3>

                    <p
                      className="text-sm mb-3 break-all hover:underline cursor-pointer"
                      style={{ color: brandColor }}
                    >
                      {banner.link}
                    </p>

                    <div className="space-y-1 text-sm text-gray-500 mb-4">
                      <p>
                        Created:{" "}
                        {new Date(banner.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 border-2 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium hover:shadow-md"
                      style={{
                        borderColor: brandColor,
                        color: brandColor,
                        backgroundColor: brandColorLight,
                      }}
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

      {/* ===================== PROFESSIONAL EDIT MODAL ===================== */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn my-auto"
            style={{
              borderTop: `5px solid ${brandColor}`,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            {/* HEADER */}
            <div
              className="px-8 py-6 flex items-center justify-between"
              style={{ backgroundColor: brandColorLight }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: brandColor }}
                >
                  Edit Banner
                </h2>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-2 rounded-lg hover:bg-white transition-all duration-300 hover:shadow-md"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* BODY */}
            <div className="px-8 py-8">
              <div className="space-y-8">
                {/* Banner Name */}
                <div className="space-y-3">
                  <label
                    className="font-semibold text-sm uppercase tracking-wider block"
                    style={{ color: brandColor }}
                  >
                    Banner Name *
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300"
                    style={{
                      focusRing: `${brandColor}33`,
                      focusRingOffset: "white",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = brandColor;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColor}22`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="Enter banner name"
                  />
                </div>

                {/* Banner Link */}
                <div className="space-y-3">
                  <label
                    className="font-semibold text-sm uppercase tracking-wider block"
                    style={{ color: brandColor }}
                  >
                    Banner Link *
                  </label>
                  <input
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-300"
                    style={{ borderColor: "#e5e7eb" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = brandColor;
                      e.target.style.boxShadow = `0 0 0 3px ${brandColor}22`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="https://example.com"
                  />
                </div>

                {/* Image Section */}
                <div className="space-y-4">
                  <label
                    className="font-semibold text-sm uppercase tracking-wider block"
                    style={{ color: brandColor }}
                  >
                    Banner Image *
                  </label>

                  {/* Current Preview */}
                  {editImagePreview && (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 group cursor-pointer">
                      <img
                        src={editImagePreview}
                        className="w-full h-72 object-cover group-hover:brightness-75 transition-all duration-300"
                        alt="Banner preview"
                      />

                      {editImageFile && (
                        <div
                          className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                          style={{ backgroundColor: `${brandColor}88` }}
                        >
                          <div className="bg-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="font-semibold text-gray-800">
                              New image selected
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Upload overlay */}
                      <label
                        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        style={{ backgroundColor: `${brandColor}88` }}
                      >
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleEditImageChange}
                        />
                        <div className="text-white text-center">
                          <Upload className="w-10 h-10 mx-auto mb-2" />
                          <p className="font-semibold">Change Image</p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Upload Area */}
                  {!editImagePreview && (
                    <label
                      className="block border-3 border-dashed rounded-2xl py-12 text-center cursor-pointer transition-all duration-300 hover:scale-102"
                      style={{
                        backgroundColor: brandColorLight,
                        borderColor: `${brandColor}44`,
                      }}
                    >
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleEditImageChange}
                      />
                      <div className="space-y-2">
                        <Upload
                          className="w-12 h-12 mx-auto"
                          style={{ color: brandColor }}
                        />
                        <p
                          className="font-semibold text-lg"
                          style={{ color: brandColor }}
                        >
                          Upload Banner Image
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, AVIF • Up to 10MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {/* ERROR MESSAGE */}
                {uploadError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex shrink-0 mt-0.5" />
                    <span className="text-red-700 font-medium">
                      {uploadError}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div
              className="px-8 py-6 flex gap-3"
              style={{ backgroundColor: "#f9f6f2" }}
            >
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedBanner}
                disabled={loading || uploadLoading}
                className="flex-1 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105"
                style={{ backgroundColor: brandColor }}
              >
                {loading || uploadLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Animation Styles */}
          <style>
            {`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: scale(0.92) translateY(-20px);
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}
          </style>
        </div>
      )}
    </div>
  );
}
