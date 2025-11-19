// src/components/admin/Category.jsx
import React, { useState } from 'react';

const Category = () => {
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    subCategory: '',
    images: []
  });
  const [categories, setCategories] = useState([]); // Demo state for existing categories
  const [editId, setEditId] = useState(null); // For edit mode
  const [showForm, setShowForm] = useState(false); // To toggle form visibility

  // Placeholder subcategories options
  const subCategoryOptions = [
    { value: '', label: 'Select a subcategory' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
    { value: 'books', label: 'Books' }
  ];

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
    return (
      formData.categoryId.trim() !== '' &&
      formData.name.trim() !== '' &&
      formData.subCategory !== '' &&
      formData.images.length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update existing
      setCategories(prev => prev.map(c => 
        c.id === editId ? { ...formData, id: editId } : c
      ));
      setEditId(null);
    } else {
      // Add new
      const newId = Date.now();
      setCategories(prev => [...prev, { id: newId, ...formData }]);
    }
    // Reset form and hide
    setFormData({ categoryId: '', name: '', subCategory: '', images: [] });
    setShowForm(false);
    alert(editId ? 'Category updated successfully!' : 'Category added successfully!');
  };

  const handleEdit = (category) => {
    setFormData({
      categoryId: category.categoryId,
      name: category.name,
      subCategory: category.subCategory,
      images: category.images || []
    });
    setEditId(category.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      if (editId === id) {
        setEditId(null);
        setFormData({ categoryId: '', name: '', subCategory: '', images: [] });
        setShowForm(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ categoryId: '', name: '', subCategory: '', images: [] });
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData({ categoryId: '', name: '', subCategory: '', images: [] });
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-[#FFFFFF]">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Categories</h2>

      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={openAddForm}
          className="px-6 py-2 bg-[#E1C6B3] text-white font-medium rounded-md hover:bg-[#E1C6B3]/90 transition-colors"
        >
          Add Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
              <input
                type="text"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                placeholder="Enter Category ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                placeholder="Enter Category Name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              >
                {subCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Images (Multiple Files)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              />
              {formData.images.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 px-4 py-2 font-medium rounded-md transition-colors ${
                isFormValid()
                  ? 'bg-[#E1C6B3] text-white hover:bg-[#E1C6B3]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {editId ? 'Update Category' : 'Add Category'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Existing Categories */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">There are no categories</p>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-2 flex-wrap">
                  {category.images.slice(0, 4).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Category image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                  {category.images.length > 4 && (
                    <span className="text-xs text-gray-500 self-center bg-gray-100 px-2 py-1 rounded">+{category.images.length - 4}</span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-base">{category.name}</h4>
                <p className="text-sm text-gray-600 mb-1">ID: {category.categoryId}</p>
                <p className="text-sm text-gray-500 mb-3">Subcategory: {category.subCategory}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:underline text-sm font-medium"
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

export default Category;