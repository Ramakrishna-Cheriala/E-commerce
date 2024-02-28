import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiProfileLine } from "react-icons/ri";
import { BsBorderStyle } from "react-icons/bs";
const UserMenu = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col p-3 bg-gray-200 w-72 h-screen">
      <h1 className="text-3xl font-bold font-playfair tracking-tight mb-5">
        User Menu
      </h1>
      <NavLink
        to="/dashboard/profile"
        className={`text-lg font-poppins flex items-center text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg mb-2 hover:bg-gray-400
        ${
          location.pathname === "/dashboard/profile"
            ? "font-bold bg-gray-400"
            : "bg-gray-300"
        }`}
      >
        <RiProfileLine className="mr-2" />
        Profile
      </NavLink>
      <NavLink
        to="/dashboard/orders"
        className={`text-lg font-poppins flex items-center text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg mb-2 hover:bg-gray-400
        ${
          location.pathname === "/dashboard/orders"
            ? "font-bold bg-gray-400"
            : "bg-gray-300"
        }`}
      >
        <BsBorderStyle className="mr-2" />
        Orders
      </NavLink>
    </div>
  );
};

export default UserMenu;
