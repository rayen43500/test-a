import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <ExclamationTriangleIcon className="mx-auto h-24 w-24 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            This page is restricted to certain user roles. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
            
            <Link
              to="/profile"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
