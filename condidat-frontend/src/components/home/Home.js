import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { FaGraduationCap, FaChalkboardTeacher, FaLaptopCode, FaMobileAlt, FaLightbulb, FaUsers, FaHandsHelping, FaClock, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import { RiTeamLine } from 'react-icons/ri';
import { BsGraphUp, BsBook } from 'react-icons/bs';
import TestimonialCarousel from '../testimonials/TestimonialCarousel';
import { useCourses } from '../../contexts/CourseContext';
import { format } from 'date-fns';

// Static fallback courses in case API call fails
const fallbackCourses = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Learn modern web development with React, Node.js, and more.',
    icon: <FaLaptopCode className="text-4xl text-blue-600 mb-4" />,
  },
  {
    id: 2,
    title: 'Mobile Development',
    description: 'Build cross-platform mobile apps with React Native.',
    icon: <FaMobileAlt className="text-4xl text-green-600 mb-4" />,
  },
  {
    id: 3,
    title: 'Data Science',
    description: 'Master data analysis and machine learning with Python.',
    icon: <FaGraduationCap className="text-4xl text-purple-600 mb-4" />,
  },
];

// Navbar has been moved to src/components/common/Navbar.js

const Hero = () => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          <span className="block mb-1">Advance Your Career With</span>
          <span className="block text-yellow-300">Professional Training</span>
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-xs text-blue-100 sm:text-sm">
          Join thousands of professionals who have accelerated their careers with our industry-leading courses and expert instructors.
          <span className="block mt-1 text-blue-200">Start learning today and transform your future.</span>
        </p>
          
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="px-6 py-2.5 bg-white text-blue-700 font-medium rounded-full text-sm hover:bg-blue-50 transition-colors flex items-center"
          >
            Get Started
            <svg className="ml-1.5 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link
            to="#courses"
            className="px-6 py-2.5 border border-white/30 text-white font-medium rounded-full text-sm hover:bg-white/10 transition-colors flex items-center"
          >
            Explore Courses
            <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>
        
        <div className="mt-10 flex items-center justify-center space-x-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <img 
                key={i}
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt={`Student ${i}`}
                className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback to a default avatar if the image fails to load
                  e.target.onerror = null;
                  e.target.src = 'https://i.pravatar.cc/100?img=0';
                }}
              />
            ))}
          </div>
          <div className="text-left">
            <p className="text-xs text-white/80">Join our community of</p>
            <p className="text-sm font-semibold text-white">10,000+ Happy Students</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Features = () => (
  <div className="py-10 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-xs text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
        <p className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          A better way to learn
        </p>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                <FaGraduationCap className="h-5 w-5" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Why Choose Our Instructor Program?</h3>
              <p className="mt-1 text-xs text-gray-500">
                Learn from industry experts with real-world experience.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                <FaChalkboardTeacher className="h-5 w-5" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Interactive Learning</h3>
              <p className="mt-1 text-xs text-gray-500">
                Engage with hands-on projects and real-world scenarios.
              </p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                <FaLaptopCode className="h-5 w-5" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Flexible Schedule</h3>
              <p className="mt-1 text-xs text-gray-500">
                Learn at your own pace with 24/7 access to course materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Courses = () => {
  const { formations, loadFormations, loading } = useCourses();

  // Load courses on component mount
  useEffect(() => {
    loadFormations({ limit: 3 }); // Load only 3 featured courses
  }, [loadFormations]);

  // Use API courses if available, otherwise fallback to static courses
  const displayCourses = formations.length > 0 ? formations.slice(0, 3) : fallbackCourses;

  return (
    <div id="courses" className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Shaping Future Educators and Professionals
          </h2>
          <p className="mt-1 max-w-2xl mx-auto text-xs text-gray-500">
            Start learning with our most popular courses
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayCourses.map((course) => (
              <div key={course.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 hover:border-blue-100">
                {/* Course Image with Overlay */}
                <div className="relative h-44 overflow-hidden">
                  {course.image ? (
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <FaGraduationCap className="h-10 w-10 text-blue-400" />
                    </div>
                  )}
                  
                  {/* Level Badge */}
                  {course.level && (
                    <span className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Link 
                      to={`/courses/${course.id}`}
                      className="w-full text-center text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {course.title}
                      </h3>
                    </div>
                    
                    <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <FaClock className="mr-1.5 text-blue-400" size={12} />
                        <span>{course.duration} hours • {course.lessons || 12} lessons</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <FaUserFriends className="mr-1.5 text-blue-400" size={12} />
                        <span>{course.current_participants || 0} enrolled of {course.max_participants || 'Unlimited'} spots</span>
                      </div>
                      
                      {course.instructor && (
                        <div className="flex items-center text-xs text-gray-500">
                          <FaChalkboardTeacher className="mr-1.5 text-blue-400" size={12} />
                          <span>By {course.instructor.name || 'Expert Instructor'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Price & CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-base font-bold text-gray-900">
                          ${Number(course.price || 0).toFixed(2)}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            ${Number(course.originalPrice).toFixed(2)}
                          </span>
                        )}
                        {course.discount > 0 && (
                          <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                            {course.discount}% OFF
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/formations/${course.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-500 flex items-center group-hover:translate-x-1 transition-transform duration-200"
                      >
                        Learn more <span className="ml-0.5">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Link
            to="/formations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </div>
  );
};


const About = () => {
  const stats = [
    { value: '100+', label: 'Certified Instructors', icon: <FaChalkboardTeacher className="w-8 h-8 text-blue-600" /> },
    { value: '10K+', label: 'Students Trained', icon: <FaGraduationCap className="w-8 h-8 text-blue-600" /> },
    { value: '50+', label: 'Courses Available', icon: <BsBook className="w-8 h-8 text-blue-600" /> },
    { value: '95%', label: 'Success Rate', icon: <BsGraphUp className="w-8 h-8 text-blue-600" /> },
  ];

  const features = [
    {
      icon: <FaLightbulb className="w-6 h-6 text-yellow-500" />,
      title: 'Innovative Learning',
      description: 'Cutting-edge teaching methodologies that inspire and engage' 
    },
    {
      icon: <FaUsers className="w-6 h-6 text-blue-500" />,
      title: 'Expert Community',
      description: 'Join a network of passionate educators and professionals'
    },
    {
      icon: <RiTeamLine className="w-6 h-6 text-green-500" />,
      title: 'Dedicated Support',
      description: 'Guidance and resources at every step of your journey'
    },
    {
      icon: <FaHandsHelping className="w-6 h-6 text-purple-500" />,
      title: 'Hands-on Training',
      description: 'Practical experience to build real-world teaching skills'
    }
  ];

  return (
    <section id="about" className="relative bg-white ">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-2 py-0.5 text-[9px] font-semibold text-blue-700 bg-blue-100 rounded-full mb-2">
            About EduForm Pro
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
            Empowering <span className="text-blue-600">Educators</span>, Transforming <span className="text-blue-600">Lives</span>
          </h2>
          <div className="mt-2 max-w-4xl mx-auto text-[11px] text-gray-600 space-y-2 text-left">
            <p>We're on a mission to revolutionize education by developing exceptional teaching talent and creating impactful learning experiences.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center transform transition-all hover:scale-105">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
                {stat.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{stat.value}</h3>
              <p className="mt-0.5 text-gray-600 text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Courses />
        <About />
        <TestimonialCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
