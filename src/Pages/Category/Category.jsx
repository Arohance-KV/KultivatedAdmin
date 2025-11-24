// src/components/admin/Category.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  clearMessages,
} from '../../redux/CategorySlice';

const Category = () => {
  const dispatch = useDispatch();

  // ✅ Correct slice key: "category" (matches store.js)
  const categoryState = useSelector((state) => state.category || {});
  const {
    categories = [],
    loading = false,
    error = null,
    successMessage = null,
  } = categoryState;

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    subCategoryIds: [],
    imageFiles: [], // local File objects for new uploads
    description: '',
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState([]); // array of URLs (existing or local)
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Auto-clear messages after 4s
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setFormData((prev) => ({
      ...prev,
      imageFiles: files,
    }));

    // Create preview URLs for the newly selected files
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSubCategories = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, subCategoryIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to handle file uploads
    const formDataToSend = new FormData();
    if (formData.categoryId.trim()) {
      formDataToSend.append('categoryId', formData.categoryId.trim());
    }
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim() || '');
    formDataToSend.append('isActive', String(formData.isActive)); // ✅ send as string

    // Append image files (only for newly selected files)
    formData.imageFiles.forEach((file) => {
      formDataToSend.append('imageFiles', file);
    });

    // Append subcategory IDs
    if (formData.subCategoryIds.length > 0) {
      formData.subCategoryIds.forEach((id) => {
        formDataToSend.append('subCategoryIds', id);
      });
    }

    try {
      if (editId) {
        // Update
        await dispatch(
          updateCategory({ categoryId: editId, updateData: formDataToSend })
        ).unwrap();
      } else {
        // Create
        await dispatch(createCategory(formDataToSend)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Form submission error:', err);
      // Error is already stored in Redux by rejected case
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      name: '',
      subCategoryIds: [],
      imageFiles: [],
      description: '',
      isActive: true,
    });
    setImagePreview([]);
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (cat) => {
    setFormData({
      categoryId: cat.categoryId || '',
      name: cat.name || '',
      subCategoryIds: cat.subCategoryIds || [],
      imageFiles: [], // existing images are URLs, not File objects
      description: cat.description || '',
      isActive: cat.isActive ?? true,
    });

    // ✅ Normalize imageUrl to array of URLs for preview
    let previews = [];
    if (Array.isArray(cat.imageUrl)) {
      previews = cat.imageUrl;
    } else if (typeof cat.imageUrl === 'string' && cat.imageUrl.trim() !== '') {
      previews = [cat.imageUrl];
    }
    setImagePreview(previews);

    setEditId(cat._id);
    setShowForm(true);
  };

  const startDelete = (cat) => {
    if (window.confirm('Delete this category permanently?')) {
      dispatch(deleteCategory(cat._id));
    }
  };

  const removeImagePreview = (index) => {
    // This only removes from UI & selected files.
    // Existing images on server are not removed unless your backend supports it.
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h2>

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

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="mb-6 px-6 py-3 bg-[#ce8b5b] text-white font-semibold rounded-lg hover:bg-[#cd712f]"
        >
          + Add New Category
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h3 className="text-2xl font-semibold mb-6">
              {editId ? 'Update' : 'Create'} Category
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Category ID *</label>
                  <input
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E1C6B3]"
                    placeholder="CAT001"
                  />
                </div>

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

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Description (optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Subcategory IDs (optional – Ctrl/Cmd + click)
                  </label>
                  <select
                    multiple
                    value={formData.subCategoryIds}
                    onChange={handleSubCategories}
                    className="w-full px-4 py-2 border rounded-lg h-32"
                  >
                    <option value="65eeab737c177a197b4a111d">Wedding Rings</option>
                    <option value="65eead997c177a197b4a1120">Engagement Rings</option>
                    <option value="67fe5db40254f62d3e5fe9d1">Fashion Rings</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Images (select multiple files)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFiles}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selecting new images will not automatically remove existing ones on the server.
                  </p>
                </div>
              </div>

              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Image Preview:</p>
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreview.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${idx}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#c18154] text-white rounded-lg hover:bg-[#c46c39] disabled:opacity-70"
                >
                  {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-[#E1C6B3]"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-gray-100 relative">
                {cat.imageUrl?.[0] || typeof cat.imageUrl === 'string' ? (
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
                  {Array.isArray(cat.subCategoryIds)
                    ? cat.subCategoryIds.length
                    : 0}{' '}
                  subcategories
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
