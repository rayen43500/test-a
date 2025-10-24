import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About Us</h3>
          <p className="text-sm text-gray-300">
            We are dedicated to providing high-quality education and professional development opportunities to help you advance your career.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="mailto:contact@eduformpro.com" className="text-gray-300 hover:text-white">
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/home" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/home#courses" className="hover:text-white transition-colors">Courses</Link></li>
            <li><Link to="/home#about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <address className="not-italic text-sm text-gray-300 space-y-2">
            <p>123 Education Street</p>
            <p>Tunis, Tunisia</p>
            <p>Email: contact@eduformpro.com</p>
            <p>Phone: +216 12 345 678</p>
          </address>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">Subscribe to our newsletter for the latest updates and courses.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} EduForm Pro. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
