import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';
import NotificationBell from '../common/NotificationBell';
import ChatSidebar from '../common/ChatSidebar';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TagIcon,
  ChevronDownIcon,
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const role = (user?.role || '').toString();
  const roleLower = role.toLowerCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    // Candidate base items (used for recruiter and candidate)
    const candidateItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Formations', href: '/formations', icon: AcademicCapIcon },
      { name: 'Profile', href: '/profile', icon: UserCircleIcon },
      { name: 'Chat IA', href: '#', icon: ChatBubbleLeftRightIcon, isChat: true },
    ];

    // If the user is a candidate, show the standard candidate items
    if (roleLower === 'candidat') {
      return candidateItems;
    }

    // Recruiter: show only the exact requested items
    if (roleLower === 'recruteur') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Formations', href: '/formations', icon: AcademicCapIcon },
        { name: 'Profile', href: '/profile', icon: UserCircleIcon },
        { name: 'Applications', href: '/applications', icon: UsersIcon },
        { name: 'Quizzes', href: '/quizzes', icon: AcademicCapIcon },
        { name: 'Candidats', href: '/recruiter/candidats', icon: UserGroupIcon },
        { name: 'Mes Entretiens', href: '/recruiter/entretiens', icon: CalendarIcon },
        { name: 'Job Management', href: '/recruiter/jobs', icon: BriefcaseIcon }
      ];
    }

    // Admin: start from candidate items but remove Chat IA and Applications
    if (roleLower === 'admin') {
      const adminItems = candidateItems.filter(i => !i.isChat).concat([
        { name: 'Categories', href: '/categories', icon: TagIcon },
        // Applications intentionally removed per request
        { name: 'User Management', href: '/admin/users', icon: UsersIcon },
        { name: 'Quizzes', href: '/quizzes', icon: AcademicCapIcon },
        { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }
      ]);
      return adminItems;
    }

    // Default: return candidate items (safe fallback)
    return candidateItems;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white shadow-sm">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center space-x-2 group">
              <FaGraduationCap className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                SkillUp
              </span>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

            {/* Right side - Notifications and User menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user && <NotificationBell />}
              {user ? (
                <div className="ml-3 relative" ref={userMenuRef}>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="ml-2 text-gray-700 text-sm font-medium">
                      {user?.fullname}
                    </span>
                    <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {role.toLowerCase() !== 'candidat' && (
                        <>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Your Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Settings
                          </Link>
                        </>
                      )}
                      {roleLower === 'recruteur' && (
                        <Link
                          to="/recruiter/entretiens"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          📅 Mes Entretiens
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium rounded-full hover:shadow-md hover:shadow-blue-100 hover:scale-105 transform transition-all duration-200"
                >
                  Get Started
                  <span className="ml-1.5" aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div className="pt-14 flex flex-1 overflow-hidden">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 px-2 space-y-1">
                {getNavigationItems().map((item) => (
                  item.isChat ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        setChatOpen(true);
                        setSidebarOpen(false);
                      }}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <item.icon
                        className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        location.pathname === item.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          location.pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.fullname || 'User'}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {getNavigationItems().map((item) => (
                  item.isChat ? (
                    <button
                      key={item.name}
                      onClick={() => setChatOpen(true)}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <item.icon
                        className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === item.href
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          location.pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.fullname || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role || 'User'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto focus:outline-none pt-[15px] pl-[15px]">
          <main className="flex-1 relative pb-8 z-0">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Chat Sidebar */}
      <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Layout;
