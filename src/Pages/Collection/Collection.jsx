// src/components/admin/Collection.jsx (Integrated with Redux)
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCollections, createCollection, updateCollection } from '../../redux/CollectionSlice'; // Adjust path as needed

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

const Collection = () => {
  const dispatch = useDispatch();
  const { collections, loading, error } = useSelector((state) => state.collections);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    imageFiles: [],
    existingImageUrls: [],
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imageFiles: files }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const removeExistingUrl = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      existingImageUrls: prev.existingImageUrls.filter((url) => url !== urlToRemove),
    }));
  };

  const uploadImages = async (files) => {
    if (files.length === 0) return [];
    const formDataUpload = new FormData();
    files.forEach((file) => formDataUpload.append('images', file));
    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Failed to upload images');
      }
      return result.data || result.urls || [];
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const isFormValid = () => {
    const totalImages = formData.existingImageUrls.length + formData.imageFiles.length;
    return (
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      totalImages > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      const { imageFiles, existingImageUrls, name, description, id } = formData;
      const newUrls = await uploadImages(imageFiles);
      const allImageUrls = [...existingImageUrls, ...newUrls];
      const collectionData = {
        name: name.trim(),
        imageUrls: allImageUrls,
        description: description.trim(),
        isActive: true,
      };
      if (editId) {
        await dispatch(updateCollection({ id, collectionData })).unwrap();
        alert('Collection updated successfully!');
      } else {
        await dispatch(createCollection(collectionData)).unwrap();
        alert('Collection added successfully!');
      }
      // Reset form and hide
      setFormData({
        id: null,
        name: '',
        description: '',
        imageFiles: [],
        existingImageUrls: [],
      });
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      alert(error.message || 'Something went wrong');
    }
  };

  const handleEdit = (collection) => {
    setFormData({
      id: collection._id,
      name: collection.name,
      description: collection.description,
      imageFiles: [],
      existingImageUrls: [...(collection.imageUrls || [])],
    });
    setEditId(collection._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    try {
      const response = await fetch(`${BASE_URL}/collection/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Failed to delete collection');
      }
      alert('Collection deleted successfully!');
      dispatch(fetchCollections());
    } catch (error) {
      alert(error.message);
    }
    if (editId === id) {
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      id: null,
      name: '',
      description: '',
      imageFiles: [],
      existingImageUrls: [],
    });
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData({
      id: null,
      name: '',
      description: '',
      imageFiles: [],
      existingImageUrls: [],
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-6 bg-[#FFFFFF]">Loading collections...</div>;
  }

  if (error) {
    return <div className="p-6 bg-[#FFFFFF]">Error: {error.message || error}</div>;
  }

  return (
    <div className="p-6 bg-[#FFFFFF]">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Collections</h2>

      {/* Add Collection Button */}
      <div className="mb-6">
        <button
          onClick={openAddForm}
          className="px-6 py-2 bg-[#c28356] text-white font-medium rounded-md hover:bg-[#c46c39]/90"
        >
          Add Collection
        </button>
      </div>

      {/* Add/Edit Collection Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3]"
              required
            />
          </div>

          {editId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
              {formData.existingImageUrls.length === 0 ? (
                <p className="text-gray-500 text-sm">No existing images.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.existingImageUrls.map((url, index) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingUrl(url)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {editId ? 'Add New Images (Optional)' : 'Images (Multiple Files)'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3]"
            />
            {formData.imageFiles.length > 0 && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.imageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3]"
              placeholder="Enter description"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 px-4 py-2 font-medium rounded-md transition-colors ${
                isFormValid()
                  ? 'bg-[#c28356] text-white hover:bg-[#c46c39]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {editId ? 'Update Collection' : 'Add Collection'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Existing Collections */}
      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">There are no collections</p>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div key={collection._id} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex gap-1 mb-2 flex-wrap">
                  {collection.imageUrls.slice(0, 4).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Collection image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                  {collection.imageUrls.length > 4 && (
                    <span className="text-xs text-gray-500 self-center">
                      +{collection.imageUrls.length - 4}
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{collection.name}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(collection._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;