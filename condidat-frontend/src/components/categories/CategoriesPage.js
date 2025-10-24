import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../contexts/CourseContext';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

const CategoriesPage = () => {
  const { categories, loadCategories, createCategory } = useCourses();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Charger les catégories avec debounce pour éviter les appels multiples
  useEffect(() => {
    setIsLoading(true);
    const debounced = debounce(async () => {
      try {
        await loadCategories();
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    debounced();

    return () => debounced.cancel();
  }, [loadCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setIsLoading(true);
      await createCategory(formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      await loadCategories();
      toast.success('Category created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create category';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showCreateForm ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                    )}
                  </div>
                  <Link
                    to={`/categories/${category.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 text-center text-gray-500">
              No categories found. Create your first category!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
