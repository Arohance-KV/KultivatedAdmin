// src/components/admin/Collection.jsx (Integrated with Redux Upload - Debug Version)
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCollections, createCollection, updateCollection } from '../../redux/CollectionSlice';
import { uploadImageAsync, clearUploadedImages } from '../../redux/UploadImgSlice';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

const Collection = () => {
  const dispatch = useDispatch();
  const { collections, loading: collectionLoading, error: collectionError } = useSelector((state) => state.collections);
  const { imageUrls: uploadedUrls, loading: uploadLoading, error: uploadError } = useSelector((state) => state.upload);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    imageFiles: [],
    existingImageUrls: [],
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  // Update existing image URLs when Redux upload completes
  useEffect(() => {
    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        existingImageUrls: [...prev.existingImageUrls, ...uploadedUrls],
        imageFiles: [],
      }));
      dispatch(clearUploadedImages());
    }
  }, [uploadedUrls, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imageFiles: files }));
  };

  const handleUploadImages = async () => {
    if (formData.imageFiles.length === 0) return;
    
    try {
      for (const file of formData.imageFiles) {
        await dispatch(uploadImageAsync(file)).unwrap();
      }
    } catch (error) {
      alert(error || 'Failed to upload images');
    }
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
      const { existingImageUrls, name, description, id } = formData;
      const collectionData = {
        name: name.trim(),
        imageUrls: existingImageUrls,
        description: description.trim(),
        isActive: true,
      };

      // Log the data being sent for debugging
      console.log('Submitting collection data:', collectionData);
      setDebugInfo(`Submitting: ${JSON.stringify(collectionData, null, 2)}`);

      if (editId) {
        console.log('Updating collection with ID:', id);
        const result = await dispatch(updateCollection({ id, collectionData })).unwrap();
        console.log('Update result:', result);
        alert('Collection updated successfully!');
      } else {
        console.log('Creating new collection');
        const result = await dispatch(createCollection(collectionData)).unwrap();
        console.log('Create result:', result);
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
      setDebugInfo('');
    } catch (error) {
      console.error('Submit error:', error);
      const errorMsg = error.message || error || 'Something went wrong';
      setDebugInfo(`Error: ${errorMsg}`);
      alert(errorMsg);
    }
  };

  const handleEdit = (collection) => {
    console.log('Editing collection:', collection);
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
    setDebugInfo('');
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
    setDebugInfo('');
  };

  if (collectionLoading) {
    return <div className="p-6 bg-[#FFFFFF]">Loading collections...</div>;
  }

  if (collectionError) {
    return <div className="p-6 bg-[#FFFFFF]">Error: {collectionError.message || collectionError}</div>;
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
              disabled={uploadLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] disabled:bg-gray-100"
            />
            
            {uploadError && (
              <p className="text-red-500 text-sm mt-2">{uploadError}</p>
            )}

            {formData.imageFiles.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
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
                        disabled={uploadLoading}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={uploadLoading || formData.imageFiles.length === 0}
                  className={`w-full px-4 py-2 font-medium rounded-md transition-colors ${
                    uploadLoading || formData.imageFiles.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Images'}
                </button>
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

          {/* Debug Info */}
          {debugInfo && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 max-h-40 overflow-auto">
              <p className="font-semibold mb-2">Debug Info:</p>
              <pre>{debugInfo}</pre>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isFormValid() || uploadLoading}
              className={`flex-1 px-4 py-2 font-medium rounded-md transition-colors ${
                isFormValid() && !uploadLoading
                  ? 'bg-[#c28356] text-white hover:bg-[#c46c39]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {editId ? 'Update Collection' : 'Add Collection'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={uploadLoading}
              className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 disabled:opacity-50"
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