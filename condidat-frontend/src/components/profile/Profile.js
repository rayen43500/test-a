import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullname: user?.fullname || '',
      username: user?.username || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      address: user?.address || '',
      bio: user?.bio || '',
      skills: user?.skills || '',
      annees_experience: user?.annees_experience || '',
      website: user?.website || '',
      portfolio_url: user?.portfolio_url || '',
      linkedin_url: user?.linkedin_url || '',
      github_url: user?.github_url || '',
      birthdate: user?.birthdate || '',
      gender: user?.gender || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clean the data - remove empty strings and convert to appropriate types
      const cleanedData = {};
      Object.keys(data).forEach(key => {
        const value = data[key];
        // Skip read-only fields
        if (key === 'role' || key === 'id') {
          return;
        }
        if (value !== '' && value !== null && value !== undefined) {
          // Convert numeric fields
          if (key === 'annees_experience' && value) {
            cleanedData[key] = parseInt(value, 10);
          } else {
            cleanedData[key] = value;
          }
        }
      });

      console.log('Sending profile data:', cleanedData);
      await updateProfile(cleanedData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const profileCompleteness = () => {
    const fields = [
      user?.fullname,
      user?.email,
      user?.phone_number,
      user?.address,
      user?.bio,
      user?.skills,
      user?.annees_experience,
    ];
    const completed = fields.filter(field => field && field.toString().trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completeness = profileCompleteness();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-xl font-medium text-white">
                    {user?.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{user?.fullname}</h1>
                <p className="text-sm text-gray-500">{user?.role} • {user?.email}</p>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          completeness >= 80 ? 'bg-green-500' : 
                          completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{completeness}% complete</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  {...register('fullname', { required: 'Full name is required' })}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
                {errors.fullname && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone_number')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  {...register('birthdate')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  {...register('gender')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                {...register('address')}
                disabled={!isEditing}
                rows={3}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  !isEditing ? 'bg-gray-50' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Professional Information
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  {...register('bio')}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    {...register('skills')}
                    disabled={!isEditing}
                    placeholder="e.g., Python, JavaScript, React"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                  <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    {...register('annees_experience')}
                    disabled={!isEditing}
                    min="0"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      !isEditing ? 'bg-gray-50' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Links & Social Media
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  {...register('website')}
                  disabled={!isEditing}
                  placeholder="https://yourwebsite.com"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio</label>
                <input
                  type="url"
                  {...register('portfolio_url')}
                  disabled={!isEditing}
                  placeholder="https://portfolio.com"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  {...register('linkedin_url')}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/username"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub</label>
                <input
                  type="url"
                  {...register('github_url')}
                  disabled={!isEditing}
                  placeholder="https://github.com/username"
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
