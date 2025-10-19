import React from 'react';

const Footer = () => {
  const footerLinks = {
    'Audio Description': '#',
    'Help Centre': '#',
    'Gift Cards': '#',
    'Media Centre': '#',
    'Investor Relations': '#',
    'Jobs': '#',
    'Terms of Use': '#',
    'Privacy': '#',
    'Legal Notices': '#',
    'Cookie Preferences': '#',
    'Corporate Information': '#',
    'Contact Us': '#'
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'Instagram', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.508 0-4.541-2.033-4.541-4.541s2.033-4.541 4.541-4.541 4.541 2.033 4.541 4.541-2.033 4.541-4.541 4.541zm7.119 0c-2.508 0-4.541-2.033-4.541-4.541s2.033-4.541 4.541-4.541 4.541 2.033 4.541 4.541-2.033 4.541-4.541 4.541z' },
    { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
    { name: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
  ];

  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-black text-gray-400 py-8 md:py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Contact Info - Mobile First */}
        <div className="mb-6 md:mb-8">
          <p className="text-sm md:text-base text-gray-300 mb-4">
            Questions? Call <span className="hover:underline cursor-pointer">000-800-919-1694</span>
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center md:justify-start space-x-4 md:space-x-6 mb-6 md:mb-8">
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href="#" 
              className="p-2 md:p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-full text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
              aria-label={social.name}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={social.icon} />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer Links Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          {Object.entries(footerLinks).map(([text, href]) => (
            <a 
              key={text}
              href={href} 
              className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors duration-200 hover:underline py-1 md:py-2 block"
            >
              {text}
            </a>
          ))}
        </div>

        {/* Service Code Button - Responsive */}
        <div className="flex justify-center md:justify-start mb-6 md:mb-8">
          <button className="border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white px-3 md:px-4 py-2 text-xs md:text-sm transition-all duration-200 rounded hover:bg-gray-800/30 backdrop-blur-sm">
            Service Code
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 md:pt-8">
          {/* Copyright and Company Info - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
              <p className="text-xs md:text-sm text-gray-500">
                © 1997-2024 Netflix-Gemini, Inc.
              </p>
              <div className="flex items-center justify-center md:justify-start text-xs md:text-sm text-gray-500">
                Made with 
                <span className="text-red-500 mx-1 animate-pulse text-base">❤️</span> 
                in India
              </div>
            </div>
            
            {/* Legal Disclaimer */}
            <div className="bg-gray-900/50 rounded-lg p-3 md:p-4 backdrop-blur-sm">
              <p className="text-xs text-gray-500 leading-relaxed">
                This is a demo application built for educational purposes. 
                Netflix is a trademark of Netflix, Inc. All movie data is provided by 
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer"> TMDB API</span>.
              </p>
            </div>
            
            {/* Additional Links - Mobile */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 pt-2">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
