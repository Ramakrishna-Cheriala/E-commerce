import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    handleValidation();
  }, [username, email, number, password]);

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numberRegex = /^0?[1-9][0-9]{9}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    const isEmailValid = emailRegex.test(email);
    const isNumberValid = numberRegex.test(number);
    const isPasswordValid = passwordRegex.test(password);

    setIsValid(isEmailValid && isNumberValid && isPasswordValid);
  };

  const handleBlur = (inputField) => {
    if (inputField === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Invalid email format");
      }
    } else if (inputField === "number") {
      const numberRegex = /^0?[1-9][0-9]{9}$/;
      if (!numberRegex.test(number)) {
        setErrorMessage("Invalid phone number (10 digits required)");
      }
    } else if (inputField === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      if (!passwordRegex.test(password)) {
        setErrorMessage(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
        );
      }
    } else {
      setErrorMessage("");
      setIsValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleValidation();
    if (isValid) {
      await Axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
        name: username,
        email,
        number,
        address,
        password,
      })
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message);
            console.log(response.data.message);
            navigate("/login");
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message);
            setErrorMessage(error.response.data.message);
          }
        });
    } else {
      console.log("error");
      setErrorMessage("Please enter valid email, phone number, and password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-500 to-purple-500">
      <div className="sign-up bg-gray-100 p-8 border border-gray-300 rounded-lg w-96">
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <h2 className="text-3xl mb-6 text-center font-playfair">Sign up</h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full border-gray-300 rounded-md p-3"
              autoComplete="False"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="False"
              className="w-full border-gray-300 rounded-md p-3"
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="number" className="block mb-1">
              Phone number
            </label>
            <input
              type="text"
              id="number"
              autoComplete="False"
              className="w-full border-gray-300 rounded-md p-3"
              onChange={(e) => setNumber(e.target.value)}
              onBlur={() => handleBlur("number")}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="w-full border-gray-300 rounded-md p-3"
              autoComplete="False"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border-gray-300 rounded-md p-3"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              required
            />
          </div>

          <button
            type="submit"
            className={
              "block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 " +
              (!isValid ? "cursor-not-allowed opacity-50" : "")
            }
            disabled={!isValid}
          >
            Sign up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
