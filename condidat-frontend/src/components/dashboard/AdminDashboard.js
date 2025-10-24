import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import {
  UsersIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    candidats: 0,
    recruteurs: 0,
    admins: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const users = await authService.getUsers();

      const totalUsers = users.length;
      const candidats = users.filter(u => u.role === 'Candidat').length;
      const recruteurs = users.filter(u => u.role === 'Recruteur').length;
      const admins = users.filter(u => u.role === 'Admin').length;

      setStats({ totalUsers, candidats, recruteurs, admins });

      const sortedUsers = users.sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined));
      setRecentUsers(sortedUsers.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'from-sky-400 to-sky-500',
      href: '/admin/users',
    },
    {
      name: 'Candidats',
      value: stats.candidats,
      icon: UserGroupIcon,
      color: 'from-green-400 to-green-500',
      href: '/admin/users?role=Candidat',
    },
    {
      name: 'Recruteurs',
      value: stats.recruteurs,
      icon: BriefcaseIcon,
      color: 'from-indigo-400 to-indigo-500',
      href: '/admin/users?role=Recruteur',
    },
    {
      name: 'Admins',
      value: stats.admins,
      icon: ChartBarIcon,
      color: 'from-rose-400 to-rose-500',
      href: '/admin/users?role=Admin',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-b from-sky-50 to-white p-6 rounded-2xl shadow-inner">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="relative bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-sky-100 transition-transform transform hover:scale-105 hover:shadow-blue-100"
          >
            <div className={`absolute top-4 left-4 bg-gradient-to-r ${card.color} rounded-xl p-3 shadow-md`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{card.name}</p>
            <p className="ml-16 mt-2 text-3xl font-bold text-gray-900 drop-shadow-sm">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-sky-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sky-800">Recent Users</h3>
          <Link
            to="/admin/users"
            className="text-sm font-medium text-sky-600 hover:text-sky-800"
          >
            View all →
          </Link>
        </div>

        {recentUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <li key={user.id} className="py-4 flex items-center space-x-4 hover:bg-sky-50 rounded-lg px-2 transition-colors">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {user.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.fullname}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.role === 'Admin'
                      ? 'bg-rose-100 text-rose-700'
                      : user.role === 'Recruteur'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {user.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No users found.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-sky-100 p-6">
        <h3 className="text-lg font-semibold text-sky-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center p-4 bg-gradient-to-r from-sky-50 to-white rounded-xl shadow-sm hover:shadow-md hover:from-sky-100 transition-all"
          >
            <UsersIcon className="h-6 w-6 text-sky-500 mr-3" />
            <div>
              <p className="text-sm font-semibold text-sky-800">Manage Users</p>
              <p className="text-xs text-gray-500">View and edit user accounts</p>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm hover:shadow-md hover:from-blue-100 transition-all"
          >
            <ChartBarIcon className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-semibold text-blue-800">System Settings</p>
              <p className="text-xs text-gray-500">Configure system preferences</p>
            </div>
          </Link>

          <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl opacity-60 cursor-not-allowed">
            <BriefcaseIcon className="h-6 w-6 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Reports</p>
              <p className="text-xs text-gray-500">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
