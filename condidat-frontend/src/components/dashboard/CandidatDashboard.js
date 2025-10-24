import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserCircleIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const CandidatDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);

  useEffect(() => {
    // 🚧 À remplacer par les appels réels à ton API (applicationService, interviewService)
    setApplications(3);
    setInterviews(1);
  }, []);

  // ---- Calcul du taux de complétion du profil ----
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
    const completed = fields.filter((f) => f && f.toString().trim()).length;
    return Math.round((completed / fields.length) * 100);
  };
  const completeness = profileCompleteness();

  // ---- Cartes statistiques ----
  const quickStats = [
    {
      name: 'Profile Completion',
      value: `${completeness}%`,
      icon: UserCircleIcon,
      color: completeness >= 80
        ? 'from-green-400 to-green-500'
        : completeness >= 50
        ? 'from-yellow-300 to-yellow-400'
        : 'from-red-300 to-red-400',
    },
    {
      name: 'Applications',
      value: applications,
      icon: DocumentTextIcon,
      color: 'from-sky-400 to-sky-500',
    },
    {
      name: 'Interviews',
      value: interviews,
      icon: BriefcaseIcon,
      color: 'from-indigo-400 to-indigo-500',
    },
    {
      name: 'Skills',
      value: user?.skills ? user.skills.split(',').length : '0',
      icon: AcademicCapIcon,
      color: 'from-blue-400 to-blue-500',
    },
  ];

  // ---- Checklist du profil ----
  const todos = [
    { id: 1, task: 'Complete your profile', completed: completeness >= 80, link: '/profile' },
    { id: 2, task: 'Upload your CV', completed: !!user?.cv, link: '/profile' },
    { id: 3, task: 'Add your skills', completed: !!user?.skills, link: '/profile' },
    { id: 4, task: 'Write a professional bio', completed: !!user?.bio, link: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-8 rounded-3xl">
      {/* 🚨 Alerte profil incomplet */}
      {completeness < 80 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center shadow-md mb-8">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-yellow-800">
              Your profile is only {completeness}% complete
            </h3>
            <p className="text-sm text-yellow-700">
              Improve your visibility by completing your information.
              <Link to="/profile" className="ml-1 font-medium underline hover:text-yellow-600">
                Update now
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* 📊 Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div className={`absolute top-4 left-4 bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-md`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="ml-16 mt-2 text-3xl font-bold text-gray-900 transition-all duration-500">
              {stat.value}
            </p>

            {stat.name === 'Profile Completion' && (
              <div className="ml-16 mt-3 bg-gray-200 rounded-full h-2 w-40 overflow-hidden">
                <div
                  className={`h-2 transition-all duration-700 ease-out ${
                    completeness >= 80
                      ? 'bg-green-500'
                      : completeness >= 50
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  }`}
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🧩 Checklist + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ✅ Checklist */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-sky-500" /> Profile Checklist
          </h3>
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li key={todo.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  {todo.completed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <p
                    className={`ml-3 text-sm ${
                      todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}
                  >
                    {todo.task}
                  </p>
                </div>
                {!todo.completed && (
                  <Link to={todo.link} className="text-xs text-sky-600 hover:underline">
                    Complete →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ⚡ Actions rapides */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/profile"
              className="flex items-center p-3 bg-gradient-to-r from-sky-50 to-white rounded-lg hover:from-sky-100 transition-all shadow-sm hover:shadow-md"
            >
              <UserCircleIcon className="h-6 w-6 text-sky-400 mr-3" />
              <div>
                <p className="text-sm font-semibold text-sky-800">Edit Profile</p>
                <p className="text-xs text-gray-500">Update your personal info</p>
              </div>
            </Link>

            <Link
              to="/applications"
              className="flex items-center p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg hover:from-indigo-100 transition-all shadow-sm hover:shadow-md"
            >
              <DocumentTextIcon className="h-6 w-6 text-indigo-400 mr-3" />
              <div>
                <p className="text-sm font-semibold text-indigo-800">My Applications</p>
                <p className="text-xs text-gray-500">Track your submitted jobs</p>
              </div>
            </Link>

            <Link
              to="/interviews"
              className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg hover:from-blue-100 transition-all shadow-sm hover:shadow-md"
            >
              <BriefcaseIcon className="h-6 w-6 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-semibold text-blue-800">My Interviews</p>
                <p className="text-xs text-gray-500">Check upcoming interviews</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 🎉 Message de bienvenue */}
      <div className="mt-10 bg-gradient-to-r from-sky-100 to-blue-50 border border-sky-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start">
          <CheckCircleIcon className="h-6 w-6 text-sky-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-base font-semibold text-sky-800">
              Welcome back, {user?.fullname || 'Candidat'} 👋
            </h3>
            <p className="mt-1 text-sm text-sky-700">
              Manage your profile, monitor applications, and prepare for interviews.
              Let’s make your career journey successful 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatDashboard;
