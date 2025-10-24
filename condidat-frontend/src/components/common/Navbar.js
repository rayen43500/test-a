import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Check if current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-sm ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <FaGraduationCap className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              SkillUp
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
              {[
                { path: '/', name: 'Home' },
                { path: '/formations', name: 'Formations' },
                { path: '/contact', name: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    isActive(item.path)
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Right */}
          <div className="flex items-center space-x-4">
            <Link
              to="/register"
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium rounded-full hover:shadow-md hover:shadow-blue-100 hover:scale-105 transform transition-all duration-200"
            >
              Get Started
              <span className="ml-1.5" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
