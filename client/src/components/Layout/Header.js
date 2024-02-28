import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { Dropdown } from "flowbite-react";
import { HiLogout, HiViewGrid } from "react-icons/hi";
import { HiMiniUserCircle } from "react-icons/hi2";
import { FaUserTag } from "react-icons/fa";
import { MdMarkEmailUnread, MdAdminPanelSettings } from "react-icons/md";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfull");
    navigate("/login");
  };

  return (
    <div className="bg-gray-200 p-3 flex justify-between items-center shadow-gray-500 shadow-lg">
      <h1 className="text-2xl font-semibold font-playfair">E-Commerce</h1>
      <ul className="flex space-x-4 font-medium text-lg font-poppins">
        <li>
          <NavLink
            to={"/"}
            className={` hover:text-gray-900 ${
              location.pathname === "/"
                ? "border-b-2 border-gray-900"
                : "text-gray-500"
            }`}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/about"}
            className={` hover:text-gray-900 ${
              location.pathname === "/about"
                ? "border-b-2 border-gray-900"
                : "text-gray-500"
            }`}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/dashboard/cart"}
            className={` flex items-center hover:text-gray-900 ${
              location.pathname === "/cart"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500"
            }`}
          >
            Cart
          </NavLink>
        </li>
        {!auth.user ? (
          <>
            <li>
              <NavLink
                to={"/login"}
                className={`mr-3 hover:text-gray-900 ${
                  location.pathname === "/login"
                    ? "border-b-2 border-gray-900"
                    : "text-gray-500"
                }`}
              >
                Login
              </NavLink>
            </li>
          </>
        ) : (
          <>
            {!auth.user.role ? (
              <>
                <Dropdown
                  label={<HiMiniUserCircle className=" text-3xl" />}
                  inline
                >
                  <Dropdown.Header>
                    <div className="flex items-center mt-2">
                      <FaUserTag className="mr-1 text-lg" />
                      <span className="truncate text-lg font-medium">
                        {auth.user.name}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <MdMarkEmailUnread className="mr-1 text-lg" />
                      <span className="truncate text-lg font-medium">
                        {auth.user.email}
                      </span>
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Item icon={HiViewGrid}>
                    <NavLink
                      to={"/dashboard/profile"}
                      className={` flex items-center hover:text-gray-900 ${
                        location.pathname === "/dashboard/profile"
                          ? "text-gray-900 border-b-2 border-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Dashboard
                    </NavLink>
                  </Dropdown.Item>
                  {/* <Dropdown.Item icon={BsCart3}>
                    <NavLink
                      to={"/dashboard/cart"}
                      className={` flex items-center hover:text-gray-900 ${
                        location.pathname === "/cart"
                          ? "text-gray-900 border-b-2 border-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Cart
                    </NavLink>
                  </Dropdown.Item> */}
                  {/* <Dropdown.Item icon={HiCurrencyDollar}>
                    Earnings
                  </Dropdown.Item> */}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    icon={HiLogout}
                    onClick={handleLogout}
                    className="hover:text-gray-900"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown>
              </>
            ) : (
              <>
                <Dropdown
                  label={<MdAdminPanelSettings className=" text-3xl" />}
                  inline
                >
                  <Dropdown.Header>
                    <div className="flex items-center mt-2">
                      <FaUserTag className="mr-1 text-lg" />
                      <span className="truncate text-lg font-medium">
                        {auth.user.name}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <MdMarkEmailUnread className="mr-1 text-lg" />
                      <span className="truncate text-lg font-medium">
                        {auth.user.email}
                      </span>
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Item icon={RiAdminFill}>
                    <NavLink
                      to={"/admindashboard"}
                      className={` flex items-center hover:text-gray-900 ${
                        location.pathname === "/dashboard"
                          ? "text-gray-900 border-b-2 border-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      Admin Dashboard
                    </NavLink>
                  </Dropdown.Item>
                  {/*// <Dropdown.Item icon={BsCart3}>
                     <NavLink
                      to={"/Cart"}
                      className={` flex items-center hover:text-gray-900 ${
                        location.pathname === "/Cart"
                          ? "text-gray-900 border-b-2 border-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      admin panal 2
                    </NavLink> 
                  // </Dropdown.Item> */}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    icon={HiLogout}
                    onClick={handleLogout}
                    className="hover:text-gray-900"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown>
              </>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
