import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams();
  //   console.log(token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Send reset password request
      const response = await Axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/reset-password/${token}`,
        {
          password,
          token,
        }
      );

      // Check if reset password request was successful
      if (response.data.status) {
        toast.success("Password reset successful");
        // Password reset successful
        navigate("/login"); // Redirect to login page
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-500 to-blue-500">
      <div className="bg-gray-100 p-8 border border-gray-300 rounded-lg w-96">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="text-3xl mb-6 text-center font-playfair">
            Reset Password
          </h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="New Password"
              className="w-full border-gray-300 rounded-md p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full border-gray-300 rounded-md p-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
