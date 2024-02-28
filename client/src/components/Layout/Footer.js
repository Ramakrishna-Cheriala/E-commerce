import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white p-3 text-xl">
      <div className="flex justify-center items-center">
        <NavLink to="/about" className="mr-6 hover:text-gray-400">
          About Us
        </NavLink>
        <NavLink to="/contact" className="hover:text-gray-400">
          Contact
        </NavLink>
      </div>
    </div>
  );
};

export default Footer;
