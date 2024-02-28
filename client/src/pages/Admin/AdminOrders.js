import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Axios from "axios";
import { LuArrowBigUpDash } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import { Select } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([
    "Not Procesed",
    "Shipping",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [updateOrderID, setUpdateOrderID] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchOrderDetails();
  }, []);

  const handleFetchOrderDetails = () => {
    try {
      Axios.get(`${process.env.REACT_APP_API}/api/v1/product/all-orders`).then(
        (response) => {
          if (response.data.status) {
            setOrders(response.data.allOrders);
          } else {
            console.log("Error fetching orders");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (id) => {
    navigate(`/admindashboard/product-details/${id}`);
  };

  const handleStatusChange = (status, id) => {
    try {
      Axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-status`, {
        orderId: id,
        status: status,
      }).then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleFetchOrderDetails();
          setUpdateOrderID(null); // Reset update mode for this order
        } else {
          console.log(response.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex">
        <div className="w-72">
          <AdminMenu />
        </div>
        <div className="flex-1 p-5">
          <h1 className="text-3xl font-bold mb-4">All Orders</h1>
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 mb-4 px-3 py-2 border border-gray-300 rounded-md"
          />
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="my-4 p-4 bg-white shadow-md rounded-md"
            >
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              {updateOrderID === order._id ? (
                <div className="flex items-center text-xl">
                  <p className="font-bold mr-2">Order Status:</p>
                  <Select
                    onChange={(value) => {
                      handleStatusChange(value, order._id);
                    }}
                    defaultValue={order.status}
                    className="text-lg w-40"
                  >
                    {status.map((s, i) => (
                      <Option key={i} value={s} className="text-lg">
                        {s}
                      </Option>
                    ))}
                  </Select>
                </div>
              ) : (
                <p className="mt mr-2 font-poppins font-semibold text-xl">
                  Order Status: {order.status}
                </p>
              )}

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
              <div className="mt-2 mr-2">
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
                      onClick={() => handleClick(product.productId)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold mt-2">User Details:</h3>

              <div>
                <p>Name: {order.buyers.name}</p>
                <p>Email: {order.buyers.email}</p>
                <p>Phone Number: {order.buyers.number}</p>
              </div>
              <div className="flex justify-end">
                {updateOrderID === order._id ? (
                  <button
                    className="flex text-xl mr-4 p-3 border border-black rounded-md"
                    onClick={() => {
                      setUpdateOrderID(null);
                    }}
                  >
                    <MdCancel className="mt-1 mr-1" />
                    Cancel
                  </button>
                ) : (
                  <button
                    className="flex text-xl p-3 mr-4 border border-black rounded-md"
                    onClick={() => {
                      setUpdateOrderID(order._id);
                    }}
                  >
                    <LuArrowBigUpDash className="mt-1" />
                    Update
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
