import React from 'react'

function BlogList({ blogs, onEdit, onDelete }) {
  if (blogs.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 text-center py-16">
        <div className="mx-auto h-24 w-24 bg-linear-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <div className="text-gray-500 text-xl font-semibold mb-2">No blogs added yet</div>
        <p className="text-gray-400">Click "Add New Blog" to start creating amazing content</p>
      </div>
    )
  }

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id)
    }
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-gray-200/50">
      <div className="px-6 py-5 bg-linear-to-r from-green-50 to-blue-50 border-b border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
          <div className="h-8 w-8 bg-linear-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span>Blogs ({blogs.length})</span>
        </h3>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-linear-to-r from-green-100 to-green-200 text-green-800 shadow-sm">
                    {blog.category}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    blog.published 
                      ? 'bg-linear-to-r from-blue-100 to-blue-200 text-blue-800' 
                      : 'bg-linear-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                  {truncateText(blog.title, 50)}
                </h4>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {truncateText(blog.excerpt, 100)}
                </p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-lg font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-lg font-medium">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{blog.createdAt}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => onEdit(blog)}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogList