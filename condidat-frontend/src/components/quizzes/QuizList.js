import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import { PlusIcon, PencilIcon, EyeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const QuizList = () => {
  const { user } = useAuth();
  const { loadQuizzes, quizzes, loading, error } = useCourses();
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    is_active: ''
  });

  useEffect(() => {
    loadQuizzes(filters);
  }, [filters, loadQuizzes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="text-center py-8">Loading quizzes...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        {(user?.role === 'Admin' || user?.role === 'Instructor' || user?.role === 'Recruteur') && (
          <Link
            to="/quizzes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create Quiz
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
              placeholder="Search quizzes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {/* Categories would be loaded from API */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="is_active"
              value={filters.is_active}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {quiz.title}
                  </h2>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    quiz.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">
                    <AcademicCapIcon className="inline h-4 w-4 mr-1" />
                    {quiz.total_questions} questions
                  </span>
                  <span>
                    <i className="far fa-clock mr-1"></i>
                    {quiz.time_limit ? `${quiz.time_limit} min` : 'No limit'}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {quiz.category_name}
                  </span>
                  <span className="ml-2">
                    Passing: {quiz.passing_score}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created {format(new Date(quiz.created_at), 'MMM d, yyyy')}
                  </span>

                  <div className="flex space-x-2">
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>

                    {(user?.role === 'Admin' || user?.role === 'Instructor') && (
                      <Link
                        to={`/quizzes/${quiz.id}/edit`}
                        className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new quiz.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
