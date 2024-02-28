import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted
    Axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
      email,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Email sent");
          setLoading(false); // Set loading state to false after email is sent
          // Navigate to another page if needed
        } else {
          toast.error(response.data.message);
          setLoading(false); // Set loading state to false if there's an error
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message); // Set error message state
        }
        setLoading(false); // Set loading state to false if there's an error
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-500 to-blue-500">
      <div className="bg-gray-100 p-8 border border-gray-300 rounded-lg w-96">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="text-3xl mb-6 text-center font-playfair">
            Forgot Password
          </h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="False"
              placeholder="Email"
              className="w-full border-gray-300 rounded-md p-3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
