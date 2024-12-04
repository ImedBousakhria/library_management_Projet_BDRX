import React from "react";
import Socials from "../Socials";
import Contacts from "../Contacts";
import { useAuth } from "../../utils/AuthContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { logout } = useAuth()
  return (
    <div className="bg-[#8E6E50] flex flex-col text-white ">
      <div className=" p-5 md:max-lg:p-6 flex justify-between phone:max-md:flex-col phone:max-md:justify-center phone:max-md:gap-[3.5rem]">
        <div className=" flex flex-col gap-5 mx-[2rem] items-start">
          <h3 className="font-medium">Informations</h3>
          <Socials />
        </div>

        <div className=" flex flex-col gap-5 ml-[3rem] phone:max-md:mx-[2rem]  items-start">
          <h3 className="font-medium">Contacts</h3>
          <Contacts />
        </div>
        {/* 
        <div className=' phone:max-md:place-self-center'>
          <Map />
        </div> */}
      </div>  
      <Link to={'/login'}><h2 className=" text-center cursor-pointer" onClick={logout()}>Log out</h2> </Link>
      <span className="bg-[#150808] text-center py-4 border-t border-t-light-text text-[0.63rem] font-semibold text-white paragraph">
        © 2024 All Rights Reserved
      </span>
    </div>
  );
};

export default Footer;
