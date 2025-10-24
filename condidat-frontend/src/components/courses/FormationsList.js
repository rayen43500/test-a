import React, { useEffect, useState } from 'react';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PlusIcon } from '@heroicons/react/24/outline';

const FormationsList = () => {
  const { user } = useAuth();
  const { formations, loading, error, loadFormations } = useCourses();
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: '',
  });

  useEffect(() => {
    loadFormations(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="text-center py-8">Loading formations...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Formations</h1>
        {(user?.role === 'Admin' || user?.role === 'Instructor' || user?.role === 'Recruteur') && (
          <Link
            to="/formations/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Formation
          </Link>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search formations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {/* Categories would be loaded from the API */}
            </select>
          </div>
        </div>
      </div>

      {/* Formations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <div key={formation.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {formation.image && (
                <img 
                  src={formation.image} 
                  alt={formation.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    <Link to={`/formations/${formation.id}`} className="hover:text-blue-600">
                      {formation.title}
                    </Link>
                  </h2>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {formation.level.charAt(0).toUpperCase() + formation.level.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {formation.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">
                    <i className="far fa-calendar-alt mr-1"></i>
                    {format(new Date(formation.start_date), 'MMM d, yyyy')} - {format(new Date(formation.end_date), 'MMM d, yyyy')}
                  </span>
                  <span>
                    <i className="far fa-clock mr-1"></i>
                    {formation.duration} hours
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    ${Number(formation.price).toFixed(2)}
                    {formation.discount > 0 && (
                      <span className="ml-2 text-sm text-green-600">
                        {formation.discount}% off
                      </span>
                    )}
                  </span>
                  
                  <Link 
                    to={`/formations/${formation.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </Link>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      <i className="fas fa-users mr-1"></i>
                      {formation.current_participants}/{formation.max_participants} participants
                    </span>
                    <span>
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {formation.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">No formations found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationsList;
