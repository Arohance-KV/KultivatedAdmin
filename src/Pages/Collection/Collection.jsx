// src/components/admin/Collection.jsx (Updated)
import React, { useState } from 'react';

const Collection = () => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    images: [], // Changed to File[] for uploads
    description: ''
  });
  const [collections, setCollections] = useState([]); // Demo state for existing collections
  const [editId, setEditId] = useState(null); // For edit mode
  const [showForm, setShowForm] = useState(false); // To toggle form visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.images.length > 0 && formData.description.trim() !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update existing
      setCollections(prev => prev.map(c => 
        c.id === editId ? { ...formData, id: editId } : c
      ));
      setEditId(null);
    } else {
      // Add new
      const newId = Date.now();
      setCollections(prev => [...prev, { id: newId, ...formData }]);
    }
    // Reset form and hide
    setFormData({ id: null, name: '', images: [], description: '' });
    setShowForm(false);
    alert(editId ? 'Collection updated successfully!' : 'Collection added successfully!');
  };

  const handleEdit = (collection) => {
    setFormData({
      id: collection.id,
      name: collection.name,
      images: collection.images || [], // Assuming images are stored as File[] or URLs
      description: collection.description
    });
    setEditId(collection.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      setCollections(prev => prev.filter(c => c.id !== id));
      if (editId === id) {
        setEditId(null);
        setFormData({ id: null, name: '', images: [], description: '' });
        setShowForm(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ id: null, name: '', images: [], description: '' });
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData({ id: null, name: '', images: [], description: '' });
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-[#FFFFFF]">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Collections</h2>

      {/* Add Collection Button */}
      <div className="mb-6">
        <button
          onClick={openAddForm}
          className="px-6 py-2 bg-[#E1C6B3] text-white font-medium rounded-md hover:bg-[#E1C6B3]/90"
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images (Multiple Files)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3]"
              required
            />
            {formData.images.length > 0 && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
                  ? 'bg-[#E1C6B3] text-white hover:bg-[#E1C6B3]/90'
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
          <p className="text-gray-500 text-lg mb-4">There is no collections</p>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex gap-1 mb-2 flex-wrap">
                  {collection.images.slice(0, 4).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Collection image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                  {collection.images.length > 4 && (
                    <span className="text-xs text-gray-500 self-center">+{collection.images.length - 4}</span>
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
                    onClick={() => handleDelete(collection.id)}
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