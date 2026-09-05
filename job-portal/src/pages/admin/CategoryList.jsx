import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../api/categoriesApi'
import { Plus, Edit2, Trash2, Search, Tags, FolderPlus } from 'lucide-react'

export default function CategoryList() {
  const [categories, setCategories] = useState(() => getCategories())
  const [search, setSearch] = useState('')

  // Create Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Edit Modal state
  const [editingCategory, setEditingCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')

  // Delete Modal state
  const [deletingCategory, setDeletingCategory] = useState(null)

  const refreshCategories = () => {
    setCategories(getCategories())
  }

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return categories
    return categories.filter((c) => c.toLowerCase().includes(term))
  }, [categories, search])

  // Handle Create
  const handleCreate = (e) => {
    e.preventDefault()
    try {
      addCategory(newCategoryName)
      toast.success('Category created successfully!')
      setNewCategoryName('')
      setCreateModalOpen(false)
      refreshCategories()
    } catch (err) {
      toast.error(err.message || 'Failed to create category')
    }
  }

  // Handle Edit
  const handleEdit = (e) => {
    e.preventDefault()
    try {
      updateCategory(editingCategory, editCategoryName)
      toast.success('Category updated successfully!')
      setEditingCategory(null)
      setEditCategoryName('')
      refreshCategories()
    } catch (err) {
      toast.error(err.message || 'Failed to update category')
    }
  }

  // Handle Delete
  const handleDelete = () => {
    try {
      deleteCategory(deletingCategory)
      toast.success('Category deleted successfully!')
      setDeletingCategory(null)
      refreshCategories()
    } catch (err) {
      toast.error(err.message || 'Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1d4ed8] flex items-center justify-center font-bold">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Category Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage job categories used throughout the application.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setNewCategoryName('')
            setCreateModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium ml-auto">
            Total Categories: <span className="font-semibold text-gray-900">{filteredCategories.length}</span>
          </span>
        </div>

        {/* Categories Grid */}
        <div className="p-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <FolderPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No categories found.</p>
              <p className="text-gray-400 text-xs mt-1">Try a different search term or add a new category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat, idx) => (
                <div
                  key={cat}
                  className="bg-white p-4 rounded-xl border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm truncate">{cat}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingCategory(cat)
                        setEditCategoryName(cat)
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Category */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] flex items-center px-6">
              <h2 className="text-lg font-bold text-white">Create New Category</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Data Science & Analytics"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-xl shadow-sm transition text-sm"
                >
                  Create Category
                </button>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center px-6">
              <h2 className="text-lg font-bold text-white">Edit Category</h2>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-red-500 to-red-600 flex items-center px-6">
              <h2 className="text-lg font-bold text-white">Delete Category</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">“{deletingCategory}”</span>?
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition text-sm"
                >
                  Delete Category
                </button>
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
