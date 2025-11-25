import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  category: z.string().min(1, 'Category is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required').min(50, 'Content must be at least 50 characters'),
  tags: z.string(),
  published: z.boolean().default(false)
});

function BlogForm({ onSubmit, onCancel, initialData, isEditing }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);

  // React Hook Form with Zod validation
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {isValid, isDirty }
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      category: '',
      excerpt: '',
      content: '',
      tags: '',
      published: false
    },
    mode: 'onChange' // Validate on change for better UX
  });

  // Watch form values for real-time feedback
  const watchedValues = watch();

  useEffect(() => {
    if (initialData) {
      // Reset form with initial data
      reset({
        title: initialData.title || '',
        category: initialData.category || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
        published: initialData.published || false
      });

      // Set image preview if exists
      if (initialData.blogImgUrl?.url) {
        setImagePreview(initialData.blogImgUrl.url);
      }
    }
  }, [initialData, reset]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Form submission handler
  const onFormSubmit = (formValues) => {
    const submitData = {
      ...formValues,
      tags: formValues.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      featuredImage: fileToUpload, // This will be handled as FormData in parent
      // Keep original image URL if no new file uploaded
      originalImageUrl: !fileToUpload && initialData?.blogImgUrl?.url ? initialData.blogImgUrl.url : null
    };

    onSubmit(submitData);
  };

  // Character count helper
  const getCharacterCount = (value, max) => {
    const count = value?.length || 0;
    const remaining = max - count;
    const isOverLimit = remaining < 0;

    return (
      <span className={`text-xs ${ isOverLimit ? 'text-red-500' : count > max * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
        {count}/{max} {isOverLimit && '(Over limit)'}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Blog' : 'Create New Blog'}
        </h2>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${ isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isValid ? 'Valid' : 'Invalid'}
          </span>
          {isDirty && (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              Unsaved Changes
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Title Field with Character Count */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Blog Title *
            </label>
            {getCharacterCount(watchedValues.title, 200)}
          </div>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="text"
                  id="title"
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fieldState.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter an engaging blog title..."
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <select
                  {...field}
                  id="category"
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fieldState.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="industry-news">Industry News</option>
                  <option value="product-updates">Product Updates</option>
                  <option value="tutorials">Tutorials</option>
                  <option value="case-studies">Case Studies</option>
                  <option value="company-news">Company News</option>
                  <option value="technical-insights">Technical Insights</option>
                </select>
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Excerpt Field with Character Count */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt *
            </label>
            {getCharacterCount(watchedValues.excerpt, 500)}
          </div>
          <Controller
            name="excerpt"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  id="excerpt"
                  rows={3}
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fieldState.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of the blog post that will appear in previews..."
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Content Field with Character Count */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content *
            </label>
            <span className="text-xs text-gray-500">
              {watchedValues.content?.length || 0} characters (min: 50)
            </span>
          </div>
          <Controller
            name="content"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <textarea
                  {...field}
                  id="content"
                  rows={10}
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fieldState.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Write your blog content here... Support for Markdown formatting coming soon!"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Tags Field */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="tags"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tags separated by commas (e.g., tubes, industry, innovation)"
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas. Tags help categorize your content.
          </p>
        </div>

        {/* Featured Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <div className="space-y-3">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Featured Preview"
                  className="h-48 w-full object-cover border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFileToUpload(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Published Checkbox */}
        <div className="flex items-start space-x-3">
          <Controller
            name="published"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="checkbox"
                id="published"
                checked={field.value}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
            )}
          />
          <div>
            <label htmlFor="published" className="block text-sm font-medium text-gray-900">
              Publish immediately
            </label>
            <p className="text-xs text-gray-500">
              Uncheck to save as draft. You can publish later from the blog list.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
