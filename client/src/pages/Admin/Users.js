import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import { CiSearch } from "react-icons/ci";

const Users = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [promoteUser, setPromoteUser] = useState(false);
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [userRole, setUserRole] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = () => {
    try {
      Axios.get(`${process.env.REACT_APP_API}/api/v1/product/all-users`).then(
        (response) => {
          if (response.data.status) {
            setUserDetails(response.data.userDetails);
          } else {
            toast.error(response.data.message);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (id) => {
    try {
      Axios.put(`${process.env.REACT_APP_API}/api/v1/auth/promote-user/${id}`, {
        password,
        adminId: auth.user.id,
      }).then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePromote = (index) => {
    setPromoteUser(true);
    setEditIndex(index);
  };

  const handleCancel = () => {
    setPromoteUser(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const [editIndex, setEditIndex] = useState(-1);

  const filteredUsers = userDetails.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex">
        <div className="w-72">
          <AdminMenu />
        </div>
        <div className="flex-1 p-5">
          <h1 className="text-2xl font-bold">Users</h1>
          <div className="relative mt-3 mb-4">
            <input
              type="text"
              placeholder="Search by username, email, phone, or address"
              className="w-1/3 border border-gray-300 rounded-xl p-2 pl-10"
              onChange={handleSearch}
            />
            <CiSearch className="text-3xl text-gray-400 absolute top-2 left-3" />{" "}
          </div>
          <ul className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user, index) => (
              <li key={user._id}>
                <div className="bg-white shadow-md rounded-md p-4">
                  <div>
                    <span className="mt-2 mr-2 font-poppins font-semibold text-base">
                      Username:
                    </span>
                    <span>{user.name}</span>
                  </div>
                  <div>
                    <span className="mt-2 mr-2 font-poppins font-semibold text-base">
                      Email:
                    </span>
                    <span>{user.email}</span>
                  </div>
                  <div>
                    <span className="mt-2 mr-2 font-poppins font-semibold text-base">
                      Phone Number:
                    </span>
                    <span>{user.number}</span>
                  </div>
                  <div>
                    <span className="mt-2 mr-2 font-poppins font-semibold text-base">
                      Address:
                    </span>
                    <span>{user.address}</span>
                  </div>
                  <div>
                    <span className="mt-2 mr-2 font-poppins font-semibold text-base">
                      Created At:
                    </span>
                    <span>{new Date(user.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="mt-2 mr-2 font-poppins font-semibold text-base">
                      Role:
                    </span>
                    {user.role ? <span>Admin</span> : <>User</>}
                  </div>
                  <div className="flex justify-end">
                    {user.role ? (
                      <></>
                    ) : (
                      <>
                        {promoteUser && editIndex === index ? (
                          <>
                            <input
                              type="password"
                              placeholder="Enter password to continue"
                              className="w-1/3 border-gray-300 rounded-md p-3"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                              className="m-2 bg-green-500 text-white p-2 cursor-pointer rounded-md"
                              onClick={() => {
                                handleSubmit(user._id);
                              }}
                            >
                              Promote
                            </button>
                            <button
                              className="m-2 bg-red-500 text-white p-2 cursor-pointer rounded-md"
                              onClick={() => {
                                handleCancel();
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-gray-700 text-white p-2 cursor-pointer rounded-md"
                              onClick={() => {
                                handlePromote(index);
                              }}
                            >
                              Promote
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;
