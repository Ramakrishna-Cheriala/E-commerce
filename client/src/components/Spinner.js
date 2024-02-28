import { React, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const Spinner = () => {
  const [count, setCount] = useState(3);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const intervel = setInterval(() => {
      setCount((preValue) => --preValue);
    }, 1000);
    count === 0 &&
      navigate("/login", {
        state: location.pathname,
      });
    return () => clearInterval(intervel);
  }, [count, navigate, location]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!auth.user ? (
        <>
          <div className="flex items-center space-x-2">
            <ImSpinner2 className="animate-spin text-blue-500 text-4xl" />
            <span className="text-blue-500 text-lg font-semibold">
              Redirecting in {count} seconds
            </span>
          </div>
          <div className="mt-4 text-center">
            <p>
              Login to access{" "}
              <Link to="/login" className="text-blue-600">
                Login here
              </Link>
            </p>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Spinner;
