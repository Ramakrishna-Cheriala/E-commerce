import React, { useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [auth, setAuth] = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(auth.user);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleEdit = () => {
    setNewName(auth.user.name);
    setNewEmail(auth.user.email);
    setNewNumber(auth.user.phone);
    setNewAddress(auth.user.address);
    setIsEditing(true);
  };

  const handleSubmit = (id) => {
    try {
      axios
        .put(`${process.env.REACT_APP_API}/api/v1/auth/update-user/${id}`, {
          id: id,
          name: newName,
          email: newEmail,
          number: newNumber,
          address: newAddress,
        })
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message);
            setAuth({
              ...auth,
              user: response.data.user,
            });
            setIsEditing(false);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to update profile");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-72">
        <AdminMenu />
      </div>
      <div
        className="flex-1 flex justify-center items-center bg-gray-200"
        style={{
          backgroundImage: "url(/images/bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4 text-center">
            <img
              src="/images/user.png"
              alt="Profile"
              className="rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold mb-2">Profile</h2>
            <hr className="border-gray-300 mb-4" />
            <div className="flex items-center mb-4">
              <span className="mr-2 text-gray-600">Name:</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    placeholder="Username"
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold">{auth.user.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-2 text-gray-600">Email:</span>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    value={newEmail}
                    placeholder="Email"
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold">{auth.user.email}</span>
                </>
              )}
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-2 text-gray-600">Phone Number:</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold">{auth.user.phone}</span>
                </>
              )}
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Address:</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    placeholder="Address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold">{auth.user.address}</span>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              {isEditing ? (
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white mr-3 p-2 cursor-pointer rounded-md"
                    onClick={() => handleSubmit(auth.user.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 cursor-pointer rounded-md"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="flex justify-end mt-4 bg-black text-white p-2 cursor-pointer rounded-md"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
