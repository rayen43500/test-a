import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Contact = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero Section */}
    <div className="flex-grow bg-gray-50 pt-16">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 animate-fadeIn">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="block">Get In Touch With Us</span>
            <span className="block text-yellow-300">We're Here to Help</span>
          </h1>
          <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is ready to help you with any inquiries.
            <span className="block mt-1 text-blue-200">Reach out and we'll get back to you as soon as possible.</span>
          </p>
        </div>
      </section>

      {/* Contact & Form Section */}
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden md:flex animate-fadeInUp">
          
          {/* Contact Info */}
          <div className="md:w-1/2 p-6 md:p-8 space-y-8 bg-gray-50">
            <h3 className="text-2xl font-semibold text-gray-900">Contact Information</h3>
            
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p>contact@eduformpro.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p>+216 12 345 678</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p>123 Education Street, Tunis, Tunisia</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Office Hours</h4>
                <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                <p>Sat: 10:00 AM - 2:00 PM</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="md:w-1/2 p-6 md:p-8 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Apply Now</h3>
            <p className="text-sm text-gray-600 mb-6">
              Interested in joining our team of instructors? Fill out the form and we'll get back to you within 48 hours.
            </p>

            <form className="space-y-4">
              {[
                { id: 'full-name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'Your email address' },
                { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Your phone number' }
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Your Experience</label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  placeholder="Describe your experience"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>

    <Footer />
  </div>
);

export default Contact;
