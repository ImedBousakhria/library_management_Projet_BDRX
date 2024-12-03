import React from 'react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

const Socials = () => {
  return (
    <div className='flex flex-col gap-4 font-semibold'>
      <span>Social Media</span>
      <div className='flex gap-8'>
        {/* Facebook */}
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-secondary transition duration-200"
        >
          <FaFacebookF size={24} />
        </a>

        {/* X (formerly Twitter) */}
        {/* <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-secondary transition duration-200"
        >
          <FaXTwitter size={24} />
        </a> */}

        {/* LinkedIn */}
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-secondary transition duration-200"
        >
          <FaLinkedinIn size={24} />
        </a>
      </div>
    </div>
  );
};

export default Socials;
