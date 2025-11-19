// src/components/admin/Product.jsx
import React, { useState } from 'react';

const Product = () => {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    price: '',
    category: '',
    collection: '',
    material: '',
    size: '',
    color: '',
    stockQuantity: '',
    images: []
  });
  const [products, setProducts] = useState([]); // Demo state for existing products
  const [editId, setEditId] = useState(null); // For edit mode
  const [showForm, setShowForm] = useState(false); // To toggle form visibility

  // Placeholder options
  const categoryOptions = [
    { value: '', label: 'Select a category' },
    { value: 'necklace', label: 'Necklace' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelet', label: 'Bracelet' },
    { value: 'ring', label: 'Ring' },
    { value: 'pendant', label: 'Pendant' }
  ];

  const collectionOptions = [
    { value: '', label: 'Select a collection' },
    { value: 'summer', label: 'Summer Collection' },
    { value: 'wedding', label: 'Wedding Collection' },
    { value: 'everyday', label: 'Everyday Collection' },
    { value: 'luxury', label: 'Luxury Collection' }
  ];

  const materialOptions = [
    { value: '', label: 'Select material' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'platinum', label: 'Platinum' },
    { value: 'diamond', label: 'Diamond' }
  ];

  const sizeOptions = [
    { value: '', label: 'Select size' },
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'custom', label: 'Custom' }
  ];

  const colorOptions = [
    { value: '', label: 'Select color' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'rose-gold', label: 'Rose Gold' },
    { value: 'white', label: 'White' }
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
      formData.productId.trim() !== '' &&
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price.trim() !== '' &&
      formData.category !== '' &&
      formData.collection !== '' &&
      formData.material !== '' &&
      formData.size !== '' &&
      formData.color !== '' &&
      formData.stockQuantity.trim() !== '' &&
      formData.images.length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update existing
      setProducts(prev => prev.map(p => 
        p.id === editId ? { ...formData, id: editId } : p
      ));
      setEditId(null);
    } else {
      // Add new
      const newId = Date.now();
      setProducts(prev => [...prev, { id: newId, ...formData }]);
    }
    // Reset form and hide
    setFormData({
      productId: '',
      name: '',
      description: '',
      price: '',
      category: '',
      collection: '',
      material: '',
      size: '',
      color: '',
      stockQuantity: '',
      images: []
    });
    setShowForm(false);
    alert(editId ? 'Product updated successfully!' : 'Product added successfully!');
  };

  const handleEdit = (product) => {
    setFormData({
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      collection: product.collection,
      material: product.material,
      size: product.size,
      color: product.color,
      stockQuantity: product.stockQuantity,
      images: product.images || []
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (editId === id) {
        setEditId(null);
        setFormData({
          productId: '',
          name: '',
          description: '',
          price: '',
          category: '',
          collection: '',
          material: '',
          size: '',
          color: '',
          stockQuantity: '',
          images: []
        });
        setShowForm(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      productId: '',
      name: '',
      description: '',
      price: '',
      category: '',
      collection: '',
      material: '',
      size: '',
      color: '',
      stockQuantity: '',
      images: []
    });
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditId(null);
    setFormData({
      productId: '',
      name: '',
      description: '',
      price: '',
      category: '',
      collection: '',
      material: '',
      size: '',
      color: '',
      stockQuantity: '',
      images: []
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-[#FFFFFF]">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Products (Jewelry)</h2>

      {/* Add Product Button */}
      <div className="mb-6">
        <button
          onClick={openAddForm}
          className="px-6 py-2 bg-[#E1C6B3] text-white font-medium rounded-md hover:bg-[#E1C6B3]/90 transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                placeholder="Enter Product ID"
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
                placeholder="Enter Product Name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                placeholder="Enter product description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                placeholder="Enter stock quantity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
              <select
                name="collection"
                value={formData.collection}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              >
                {collectionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              >
                {materialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              >
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1C6B3] focus:border-transparent"
                required
              >
                {colorOptions.map((option) => (
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
              {editId ? 'Update Product' : 'Add Product'}
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

      {/* Existing Products */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">There are no products</p>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-2 flex-wrap">
                  {product.images.slice(0, 4).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Product image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                  {product.images.length > 4 && (
                    <span className="text-xs text-gray-500 self-center bg-gray-100 px-2 py-1 rounded">+{product.images.length - 4}</span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-base">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-1">ID: {product.productId}</p>
                <p className="text-sm text-gray-600 mb-1">Price: ${product.price}</p>
                <p className="text-sm text-gray-600 mb-1">Category: {product.category}</p>
                <p className="text-sm text-gray-600 mb-1">Material: {product.material} | Size: {product.size} | Color: {product.color}</p>
                <p className="text-sm text-gray-500 mb-3">Stock: {product.stockQuantity}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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

export default Product;