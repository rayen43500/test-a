import React from 'react';
import Slider from 'react-slick';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Data Science Student',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'Excellent learning platform! The hands-on projects helped me build a strong portfolio that landed me my dream job.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Mobile Development Student',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'The community and support here are amazing. I never felt alone in my learning journey.',
    rating: 4
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'UI/UX Design Student',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    content: 'The course material is well-structured and easy to follow. The instructors are always available to help.',
    rating: 5
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg mx-2 h-full">
    <div className="flex items-center mb-4">
      <img 
        src={testimonial.avatar} 
        alt={testimonial.name} 
        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
      />
      <div className="ml-4">
        <h4 className="text-md font-semibold text-gray-900">{testimonial.name}</h4>
        <p className="text-xs text-gray-600">{testimonial.role}</p>
        <div className="flex mt-1">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
    </div>
    <div className="relative">
      <FaQuoteLeft className="text-blue-100 text-2xl absolute -top-1 -left-1" />
      <p className="text-gray-600 text-sm italic relative pl-5">
        {testimonial.content}
      </p>
    </div>
  </div>
);

const TestimonialCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
            What Our <span className="text-blue-600">Students</span> Say
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-sm text-gray-500">
            Hear from our community of learners who have transformed their careers
          </p>
        </div>
        
        <div className="relative">
          <Slider {...settings} className="py-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-2 outline-none">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
