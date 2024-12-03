import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Import Font Awesome icons

const Contacts = () => {
  return (
    <>
      {/* Address Section */}
      <span className='flex gap-4 text-[0.75rem] items-start w-[80%]'>
        <FaMapMarkerAlt className='mt-1 text-primary' size={16} />
        <p>02, Avenue Adolphe Chauvin, 95300 Pontoise, France</p>
      </span>

      {/* Phone Numbers Section */}
      <span className='flex gap-4 items-center text-[0.75rem] w-[80%]'>
        <FaPhoneAlt className='text-primary' size={16} />
        <div className='flex flex-col'>
          <p>+33 550 55 55 55</p>
          <p>+33 23 33 33 33</p>
        </div>
      </span>

      {/* Email Section */}
      <a href="mailto:contact@CY-BookHouse.com" className="hover:text-secondary transition duration-200">
        <span className='flex gap-4 items-center text-[0.75rem] w-[80%] min-w-max'>
          <FaEnvelope className='text-primary' size={16} />
          <p>contact@CY-BookHouse.com</p>
        </span>
      </a>
    </>
  );
};

export default Contacts;
