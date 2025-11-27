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
    imageUrl: [], // Array of uploaded image URLs
    description: "",
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  // Load categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Clear messages automatically
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle subcategories selection
  const handleSubCategories = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, subCategoryIds: selected }));
  };

  // ✅ STEP 1: Upload image file → Get URL
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      setUploadingCount((prev) => prev + 1);

      try {
        console.log(`📤 Uploading image: ${file.name}`);
        
        // Call uploadImageAsync to upload the file
        const res = await dispatch(uploadImageAsync(file)).unwrap();

        console.log(`✅ Upload response:`, res);

        if (Array.isArray(res) && res.length > 0) {
          const url = res[0]; // Get the URL from response

          console.log(`✅ Image URL received: ${url}`);

          // Add to preview and formData
          setImagePreview((prev) => [...prev, url]);
          setFormData((prev) => ({
            ...prev,
            imageUrl: [...prev.imageUrl, url],
          }));
        } else {
          alert(`Unexpected response for ${file.name}`);
        }
      } catch (err) {
        console.error("❌ Upload failed:", err);
        alert(`Failed to upload ${file.name}. Please try again.`);
      } finally {
        setUploadingCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // ✅ STEP 2: Submit form with image URLs
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (uploadingCount > 0) {
      alert("Please wait for all images to finish uploading.");
      return;
    }

    if (!formData.categoryId.trim()) {
      alert("Please enter a category ID.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    // Create JSON payload (NOT FormData)
    const payload = {
      categoryId: formData.categoryId.trim(),
      name: formData.name.trim(),
      description: formData.description.trim() || "",
      isActive: formData.isActive,
      imageUrl: formData.imageUrl, // Array of URLs from upload
      subCategoryIds: formData.subCategoryIds,
    };

    console.log("🚀 Submitting category with payload:", payload);

    try {
      if (editId) {
        console.log(`📝 Updating category: ${editId}`);
        await dispatch(
          updateCategory({ categoryId: editId, updateData: payload })
        ).unwrap();
      } else {
        console.log("➕ Creating new category");
        await dispatch(createCategory(payload)).unwrap();
      }

      console.log("✅ Success! Refreshing categories...");
      await dispatch(getCategories()).unwrap();
      resetForm();
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert(`Error: ${err}`);
    }
  };

  // Reset form
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

  // Start edit mode
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

  // Delete category
  const startDelete = (cat) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(cat._id));
    }
  };

  // Remove image from preview
  const removeImagePreview = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Categories
        </h2>

        {/* SUCCESS & ERROR MESSAGES */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* ADD NEW BUTTON */}
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="mb-6 px-6 py-3 bg-[#ce8b5b] text-white font-semibold rounded-lg hover:bg-[#cd712f]"
        >
          + Add New Category
        </button>

        {/* FORM */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h3 className="text-2xl font-semibold mb-6">
              {editId ? "Update" : "Create"} Category
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* CATEGORY ID */}
                <div>
                  <label className="block font-medium mb-1">
                    Category ID *
                  </label>
                  <input
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    disabled={editId !== null}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E1C6B3] disabled:bg-gray-100"
                    placeholder="CAT001"
                  />
                </div>

                {/* NAME */}
                <div>
                  <label className="block font-medium mb-1">Name *</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E1C6B3]"
                    placeholder="Rings"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* SUBCATEGORIES */}
                <div>
                  <label className="block font-medium mb-1">
                    Subcategory IDs (optional)
                  </label>
                  <select
                    multiple
                    value={formData.subCategoryIds}
                    onChange={handleSubCategories}
                    className="w-full px-4 py-2 border rounded-lg h-32"
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

                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block font-medium mb-1">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFiles}
                    disabled={uploadingCount > 0}
                    className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadingCount > 0
                      ? `⏳ Uploading ${uploadingCount} image(s)...`
                      : "✅ Images upload immediately. You will see final cloud URLs."}
                  </p>
                </div>
              </div>

              {/* IMAGE PREVIEW */}
              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">
                    Uploaded Images ({imagePreview.length}):
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreview.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${idx}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVE */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
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
                </label>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || uploadingCount > 0}
                  className="px-8 py-3 bg-[#c18154] text-white rounded-lg hover:bg-[#c46c39] disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : uploadingCount > 0
                    ? "Uploading..."
                    : editId
                    ? "Update"
                    : "Create"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CATEGORY LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-gray-100">
                {cat.imageUrl?.[0] ? (
                  <img
                    src={
                      Array.isArray(cat.imageUrl)
                        ? cat.imageUrl[0]
                        : cat.imageUrl
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-600">ID: {cat.categoryId}</p>
                <p className="text-xs text-gray-500">
                  {cat.subCategoryIds?.length || 0} subcategories
                </p>

                <div className="mt-4 flex justify-end gap-4">
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => startDelete(cat)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && categories.length === 0 && !showForm && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-500 mb-6">No categories yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#cd712f] text-white rounded-lg"
            >
              Create First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;