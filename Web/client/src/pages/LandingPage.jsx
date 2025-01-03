import React from "react";
import hero from "../assets/hero.png";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";


const LandingPage = () => {
  return (
    <div className="flex justify-between mt-[8rem] mx-auto w-[65%] mb-[6rem]">
      <div className="flex flex-col">
        <h2 className=" font-syne text-4xl font-semibold w-[70%] leading-relaxed">
          What book are you looking for?
        </h2>
        <div className="flex items-center mt-9 px-2 py-2 w-full max-w-sm bg-white rounded-full border-2 border-yellow-950 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <Link
            to="/home"
            className="w-full flex justify-between outline-none text-sm text-black placeholder-gray-400 text-center"
          >
            <span className=" font-light text-gray-500">Search for the book of your choice</span>
            <FaSearch className="text-gray-500" size={18} />

          </Link>
        </div>
        <h3 className=" text-lg font-frank mt-4 px-3">
          Get all your books in one place
        </h3>
        <div className="flex w-[60%] gap-5 mt-8">
          <Link to={"/login"} className="basis-[50%] ">
            <button className="w-full bg-yellow-950 px-3 py-2 text-white min-w-max hover:opacity-85">
              Let's Go
            </button>
          </Link>
          <Link to={"/more"} className="basis-[50%] ">
            <button className="hover:border-2 hover:border-yellow-950 border-transparent border px-3 py-2 text-yellow-950 min-w-max transition-all duration-300">
              Learn more
            </button>
          </Link>
        </div>
      </div>
      <img src={hero} className=" h-96 w-96" alt="" />
    </div>
  );
};

export default LandingPage;
