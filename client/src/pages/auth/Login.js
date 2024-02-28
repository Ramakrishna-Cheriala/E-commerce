import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    if (auth.user && auth.user.role === 1) {
      navigate("/admindashboard");
    } else if (auth.user) {
      navigate(location.state || "/");
    }
  }, [auth, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
      input: email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          console.log("Success");
          toast.success("Welcome " + response.data.user.name);
          setAuth({
            ...auth,
            user: response.data.user,
            token: response.data.token,
          });
          localStorage.setItem("auth", JSON.stringify(response.data));
          console.log(auth.user.role);
          // if (auth.user.role === 1) {
          //   navigate("/admindashboard");
          // } else {
          //   navigate(location.state || "/");
          // }
          // // navigate(location.state || "/");
        } else {
          toast.error(response.data.message);
          console.log("Incorrect response");
        }
      })
      .catch((error) => {
        // If error response contains error message, set it in state
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrorMessage(error.response.data.message);
        }
      });
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-500 to-blue-500">
        <div className="bg-gray-100 p-8 border border-gray-300 rounded-lg w-96">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="text-3xl mb-6 text-center font-playfair">Login</h2>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                autoComplete="False"
                placeholder="Email or Username or Phone Number"
                className="w-full border-gray-300 rounded-md p-3"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full border-gray-300 rounded-md p-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Sign up here
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p>
              Forget Password?{" "}
              <Link to="/forget-password" className="text-blue-600">
                Forget Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
