import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../../contexts/CourseContext';
import { toast } from 'react-toastify';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadCategories, updateCategory, deleteCategory, categories } = useCourses();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        if (categories.length === 0) {
          await loadCategories();
        }
        const cat = categories.find((c) => c.id === parseInt(id));
        if (!cat) throw new Error('Category not found');
        setFormData({ name: cat.name, description: cat.description || '' });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCat();
  }, [id, categories, loadCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(id, formData);
      navigate('/categories');
    } catch (err) {}
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      navigate('/categories');
    } catch (err) {}
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border rounded p-2" />
        </div>
        <div className="flex space-x-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
