import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Nav = ({ navElements }) => {
  const [folded, setFolded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setFolded(true);
      } else {
        setFolded(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setFolded(false);
  }, [location.pathname]);

  return (
    <div
      className={`bg-bg fixed z-50 px-[5em] py-10 shadow-2xl flex w-full justify-between items-center mx-auto text-white border-b border-y-yellow-950  transition-all duration-300 ${
        folded ? "h-12" : "h-16"
      }`}
    >
      <Link to={"/"} className="block">
        <div className="flex items-end gap-4">
          <img src={logo} className="relative h-14" alt="Logo" />
          <span
            className={`font-semibold text-yellow-950 text-lg font-syne transition-all duration-300 ${
              folded ? "text-base" : "text-lg"
            }`}
          >
            CY Book House
          </span>
        </div>
      </Link>

      <div className="flex gap-4">
        {navElements &&
          navElements.map((navItem, index) => (
            <Link
              key={index}
              to={navItem.path}
              className="text-white hover:text-secondary transition-all duration-200"
            >
              {navItem.label}
            </Link>
          ))}
      </div>

      {!navElements && (
        <div className=" text-yellow-950">
          <Link to={"/login"}>
            <button className="px-6 py-2 border-2 font-semibold border-yellow-950 hover:bg-gray-200">
              Let's go
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Nav;
