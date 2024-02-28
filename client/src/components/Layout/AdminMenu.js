import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";
import { GrProductHunt } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import { AiFillContainer } from "react-icons/ai";

const AdminMenu = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col p-3 bg-gray-200 w-72 h-screen">
      <h1 className="text-3xl font-bold font-playfair tracking-tight mb-5">
        Admin Panel
      </h1>
      <NavLink
        to="/admindashboard/create-category"
        className={`text-lg flex items-center text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg mb-2 hover:bg-gray-400
        ${
          location.pathname === "/admindashboard/create-category"
            ? "font-bold bg-gray-400"
            : "bg-gray-300"
        }`}
      >
        <BiSolidCategory className="mr-2" />
        Categories
      </NavLink>
      <NavLink
        to="/admindashboard/create-product"
        className={`text-lg flex items-center text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg mb-2 hover:bg-gray-400
        ${
          location.pathname === "/admindashboard/create-product"
            ? "font-bold bg-gray-400"
            : "bg-gray-300"
        }`}
      >
        <GrProductHunt className="mr-2" />
        Create Product
      </NavLink>
      <NavLink
        to="/admindashboard/all-product"
        className={`text-lg flex items-center text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg mb-2 hover:bg-gray-400
        ${
          location.pathname === "/admindashboard/all-product"
            ? "font-bold bg-gray-400"
            : "bg-gray-300"
        }`}
      >
        <AiFillContainer className="mr-2" />
        Products
      </NavLink>
      <NavLink
        to="/admindashboard/users"
        className={`text-lg flex items-center text-gray-800 hover:text-gray-900 py-2 px-4 rounded-lg mb-2 hover:bg-gray-400
        ${
          location.pathname === "/admindashboard/users"
            ? "font-bold bg-gray-400"
            : "bg-gray-300"
        }`}
      >
        <PiUsersThreeFill className="mr-2" />
        Users
      </NavLink>
    </div>
  );
};

export default AdminMenu;
