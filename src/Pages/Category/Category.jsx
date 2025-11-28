import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  clearMessages,
} from "../../redux/CategorySlice";

import { uploadImageAsync } from "../../redux/UploadImgSlice";

const Category = () => {
  const dispatch = useDispatch();

  const categoryState = useSelector((state) => state.category || {});
  const {
    categories = [],
    loading = false,
    error = null,
    successMessage = null,
  } = categoryState;

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    subCategoryIds: [],
    imageUrl: [],
    description: "",
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  // Load categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Handle inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubCategories = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, subCategoryIds: selected }));
  };

  // Upload images
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      setUploadingCount((prev) => prev + 1);
      try {
        const res = await dispatch(uploadImageAsync(file)).unwrap();

        if (Array.isArray(res) && res[0]) {
          const url = res[0];
          setImagePreview((prev) => [...prev, url]);

          setFormData((prev) => ({
            ...prev,
            imageUrl: [...prev.imageUrl, url],
          }));
        }
      } catch {
        alert("Upload failed");
      } finally {
        setUploadingCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadingCount > 0) return alert("Please wait for uploads");

    if (!formData.categoryId.trim()) return alert("Enter category ID");
    if (!formData.name.trim()) return alert("Enter category name");

    const payload = {
      categoryId: formData.categoryId.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive,
      imageUrl: formData.imageUrl,
      subCategoryIds: formData.subCategoryIds,
    };

    try {
      if (editId) {
        await dispatch(
          updateCategory({ categoryId: editId, updateData: payload })
        ).unwrap();
      } else {
        await dispatch(createCategory(payload)).unwrap();
      }

      await dispatch(getCategories()).unwrap();
      resetForm();
    } catch (err) {
      alert(err);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      name: "",
      subCategoryIds: [],
      imageUrl: [],
      description: "",
      isActive: true,
    });

    setImagePreview([]);
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (cat) => {
    const images = Array.isArray(cat.imageUrl)
      ? cat.imageUrl
      : typeof cat.imageUrl === "string"
      ? [cat.imageUrl]
      : [];

    setFormData({
      categoryId: cat.categoryId || "",
      name: cat.name || "",
      subCategoryIds: cat.subCategoryIds || [],
      imageUrl: images,
      description: cat.description || "",
      isActive: cat.isActive ?? true,
    });

    setImagePreview(images);
    setEditId(cat._id);
    setShowForm(true);
  };

  const startDelete = (cat) => {
    if (window.confirm("Delete this category?")) {
      dispatch(deleteCategory(cat._id));
    }
  };

  const removeImagePreview = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));

    setFormData((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      className="p-8"
      style={{
        background: "linear-gradient(135deg, #f2e8df, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-[#c28356] tracking-wide drop-shadow-sm">
          Manage Categories
        </h2>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-all"
          style={{
            background: "#c28356",
            backdropFilter: "blur(10px)",
          }}
        >
          + Add New Category
        </button>
      </div>

      {/* SUCCESS & ERROR */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-xl shadow">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-xl shadow">
          {error}
        </div>
      )}

      {/* FORM (Glassmorphism) */}
      {showForm && (
        <div
          className="mb-10 p-6 rounded-2xl shadow-xl border"
          style={{
            background: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255, 255, 255, 0.25)",
          }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            {editId ? "Update Category" : "Create Category"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category ID */}
              <div>
                <label className="font-medium text-gray-700">
                  Category ID *
                </label>
                <input
                  name="categoryId"
                  disabled={!!editId}
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border bg-white/60 focus:ring-2 focus:ring-[#c28356]"
                />
              </div>

              {/* Name */}
              <div>
                <label className="font-medium text-gray-700">Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border bg-white/60 focus:ring-2 focus:ring-[#c28356]"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border bg-white/60 focus:ring-2 focus:ring-[#c28356]"
                />
              </div>

              {/* Subcategories */}
              <div>
                <label className="font-medium text-gray-700">
                  Subcategory IDs
                </label>

                <select
                  multiple
                  value={formData.subCategoryIds}
                  onChange={handleSubCategories}
                  className="w-full px-4 py-2 rounded-xl border bg-white/60 h-32"
                >
                  <option value="65eeab737c177a197b4a111d">
                    Wedding Rings
                  </option>
                  <option value="65eead997c177a197b4a1120">
                    Engagement Rings
                  </option>
                  <option value="67fe5db40254f62d3e5fe9d1">
                    Fashion Rings
                  </option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="font-medium text-gray-700">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingCount > 0}
                  onChange={handleImageFiles}
                  className="w-full px-4 py-2 rounded-xl border bg-white/70"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {uploadingCount
                    ? `Uploading ${uploadingCount} image(s)...`
                    : "Images upload instantly."}
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-2">Uploaded Images</p>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreview.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />

                      <button
                        type="button"
                        onClick={() => removeImagePreview(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 hidden group-hover:flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              <span>Active</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploadingCount > 0}
                className="px-8 py-3 rounded-xl text-white font-semibold shadow-md"
                style={{
                  background: "#c28356",
                }}
              >
                {loading
                  ? "Saving..."
                  : uploadingCount
                  ? "Uploading..."
                  : editId
                  ? "Update"
                  : "Create"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-3 rounded-xl bg-gray-500 text-white shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Cards — Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-5 rounded-2xl shadow-xl border transition-all hover:shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Image */}
            <div className="h-48 rounded-xl overflow-hidden mb-4 shadow-md bg-gray-200">
              {cat.imageUrl?.[0] ? (
                <img
                  src={cat.imageUrl[0]}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>

            <p className="text-sm text-gray-500">ID: {cat.categoryId}</p>

            <p className="text-xs text-gray-500 mt-1">
              {cat.subCategoryIds?.length || 0} subcategories
            </p>

            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => startEdit(cat)}
                className="text-[#c28356] font-semibold hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => startDelete(cat)}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && categories.length === 0 && !showForm && (
        <div
          className="text-center py-20 rounded-2xl shadow-xl border mt-8"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <p className="text-xl text-gray-500 mb-6">No categories found</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl text-white font-semibold"
            style={{ background: "#c28356" }}
          >
            + Create First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
