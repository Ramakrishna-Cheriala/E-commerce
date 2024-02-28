import React, { useEffect, useState } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchOrderDetails();
  }, []);

  const handleFetchOrderDetails = async () => {
    const userId = auth.user.id;
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/user-orders`,
        {
          params: { userId: userId },
        }
      );
      if (response.data.status) {
        console.log("success");
        setOrderDetails(response.data.orderDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-72 h-screen bg-gray-200">
        <UserMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        {orderDetails.map((order) => (
          <div
            key={order._id}
            className="my-4 p-4 bg-white shadow-md rounded-md"
          >
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="mt mr-2 font-poppins font-semibold text-base">
              Status: {order.status}
            </p>
            <p className="mt mr-2 font-poppins font-semibold text-base">
              Delivery Address: {order.deliveryAt}
            </p>
            <p className="mt-2 font-poppins font-semibold text-base">
              Payment Status:{" "}
              <span
                className={
                  order.payment.success ? "text-green-600" : "text-red-600"
                }
              >
                {order.payment.success ? "Success" : "Failed"}
              </span>
            </p>
            <span className="mt-2 mr-2 font-poppins font-semibold text-base">
              Ordered At:
            </span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
            <div className="mt-2 mr-2 ">
              <span className="font-poppins font-semibold text-base">
                Estimated Delivery Date:
              </span>
              <span>
                {new Date(
                  new Date(order.createdAt).setDate(
                    new Date(order.createdAt).getDate() + 6
                  )
                ).toLocaleString()}
              </span>
            </div>

            <h3 className="text-lg font-semibold mt-2">Products:</h3>
            <ul>
              {order.products.map((product, index) => (
                <li key={product.productId}>
                  {index + 1}. {product.productName} - Quantity:{" "}
                  {product.quantity}
                  <button
                    className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={() => {
                      navigate(`/product-details/${product.productId}`);
                    }}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
