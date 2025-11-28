import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCollections,
  createCollection,
  updateCollection,
} from "../../redux/CollectionSlice";

import {
  uploadImageAsync,
  clearUploadedImages,
} from "../../redux/UploadImgSlice";

const BASE_URL = "https://kk-server-lqp8.onrender.com";

const Collection = () => {
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);
  const { imageUrls: uploadedUrls, loading: uploadLoading } = useSelector(
    (state) => state.upload
  );

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    imageFiles: [],
    existingImageUrls: [],
  });

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

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
      alert(error || "Failed to upload images");
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const removeExistingUrl = (url) => {
    setFormData((prev) => ({
      ...prev,
      existingImageUrls: prev.existingImageUrls.filter((u) => u !== url),
    }));
  };

  const isFormValid = () => {
    const totalImages =
      formData.existingImageUrls.length + formData.imageFiles.length;

    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      totalImages > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const { id, name, description, existingImageUrls } = formData;

      const collectionData = {
        name: name.trim(),
        description: description.trim(),
        imageUrls: existingImageUrls,
        isActive: true,
      };

      if (editId) {
        await dispatch(updateCollection({ id, collectionData })).unwrap();
        alert("Collection updated successfully!");
      } else {
        await dispatch(createCollection(collectionData)).unwrap();
        alert("Collection added successfully!");
      }

      setFormData({
        id: null,
        name: "",
        description: "",
        imageFiles: [],
        existingImageUrls: [],
      });

      setEditId(null);
      setShowForm(false);
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const handleEdit = (collection) => {
    setFormData({
      id: collection._id,
      name: collection.name,
      description: collection.description,
      imageFiles: [],
      existingImageUrls: [...collection.imageUrls],
    });
    setEditId(collection._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;

    try {
      const res = await fetch(`${BASE_URL}/collection/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Delete failed");

      alert("Collection deleted!");
      dispatch(fetchCollections());
    } catch (error) {
      alert(error.message);
    }
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
        {/* Left Heading */}
        <h2 className="text-4xl font-bold text-[#c28356] drop-shadow-sm tracking-wide">
          Manage Collections
        </h2>

        {/* Right Button */}
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({
              id: null,
              name: "",
              description: "",
              imageFiles: [],
              existingImageUrls: [],
            });
          }}
          className="px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-all"
          style={{
            background: "#c28356",
            backdropFilter: "blur(10px)",
          }}
        >
          + Add New Collection
        </button>
      </div>

      {/* Glassmorphism Form Box */}
      {showForm && (
        <div
          className="mb-10 p-6 rounded-2xl shadow-xl border"
          style={{
            background: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255, 255, 255, 0.25)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <label className="block font-medium text-gray-700 mb-1 mt-3">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#c28356] outline-none bg-white/60"
              value={formData.name}
              onChange={handleInputChange}
            />

            {/* Existing Images */}
            {editId && (
              <div className="mt-4">
                <p className="font-medium text-gray-700 mb-2">
                  Existing Images
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.existingImageUrls.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url}
                        className="rounded-xl h-24 w-full object-cover shadow"
                      />

                      <button
                        type="button"
                        onClick={() => removeExistingUrl(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 hidden group-hover:flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New */}
            <label className="block font-medium text-gray-700 mb-2 mt-5">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full p-3 border rounded-xl bg-white/70"
              onChange={handleFileChange}
            />

            {formData.imageFiles.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {formData.imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        className="rounded-xl h-24 w-full object-cover shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 hidden group-hover:flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={uploadLoading}
                  className="mt-4 w-full px-4 py-2 rounded-xl text-white font-medium shadow-md"
                  style={{
                    background: uploadLoading ? "#d8d8d8" : "#c28356",
                  }}
                >
                  {uploadLoading ? "Uploading..." : "Upload Images"}
                </button>
              </>
            )}

            {/* Description */}
            <label className="block font-medium text-gray-700 mb-1 mt-6">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#c28356] outline-none bg-white/60"
              value={formData.description}
              onChange={handleInputChange}
            />

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl text-white font-semibold shadow-md transition-all"
                style={{
                  background: isFormValid() ? "#c28356" : "#d3c2b4",
                }}
                disabled={!isFormValid()}
              >
                {editId ? "Update Collection" : "Add Collection"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 rounded-xl font-medium shadow bg-gray-500 text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Glassmorphism Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <div
            key={collection._id}
            className="p-5 rounded-2xl shadow-xl border transition-all hover:shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <div className="flex gap-2 flex-wrap">
              {collection.imageUrls.slice(0, 4).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="w-20 h-20 object-cover rounded-xl shadow"
                />
              ))}
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-800">
              {collection.name}
            </h3>

            <p className="text-gray-600 mt-1 line-clamp-2">
              {collection.description}
            </p>

            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => handleEdit(collection)}
                className="text-[#c28356] font-medium hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(collection._id)}
                className="text-red-600 font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
