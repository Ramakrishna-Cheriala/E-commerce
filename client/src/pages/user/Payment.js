import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import Axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const Payment = () => {
  const [clientToken, setClientToken] = useState("");
  const [auth] = useAuth();
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { products, totalAmount, requiredQuantity } = location.state;
  const [deliveryAddress, setDeliveryAddress] = useState(auth.user.address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await Axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/payments/token`
        );
        setClientToken(data?.clientToken);
      } catch (error) {
        console.log(error);
      }
    };

    if (products && Array.isArray(products) && products.length > 0) {
      fetchToken();
    }
  }, [auth?.token, products]);

  const handlePayment = async () => {
    const userId = auth.user.id;
    const address = deliveryAddress;
    console.log(address);
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/payment-cart-items`,
        {
          cart: products,
          nonce,
          total: totalAmount,
          userId,
          address,
          requiredQuantity: requiredQuantity,
        }
      );
      setLoading(false);
      deleteCartItems();
      navigate("/dashboard/orders");
      toast.success("Payment successful");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteCartItems = () => {
    const userId = auth.user.id;
    try {
      Axios.delete(`${process.env.REACT_APP_API}/api/v1/cart/delete-cart`, {
        params: {
          userId,
        },
      })
        .then((response) => {
          if (response.data.status) {
            // Cart items deleted successfully
          }
        })
        .catch((error) => {
          console.error("Error deleting cart items:", error);
        });
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="w-1/2 mr-4">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">
          Delivery Address
        </h1>
        <div className="w-full p-4">
          {isEditingAddress ? (
            <>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-300 ease-in-out hover:cursor-pointer"
                onClick={() => setIsEditingAddress(false)}
              >
                Save Address
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out hover:cursor-pointer"
                onClick={() => setIsEditingAddress(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="mb-4">{deliveryAddress}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:cursor-pointer"
                onClick={() => setIsEditingAddress(true)}
              >
                Edit Address
              </button>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4 flex justify-center">
          Product Details
        </h1>
        <p className="text-2xl mt-3 mb-6 ml-3">Total Amount: {totalAmount}</p>
        <ul>
          {Array.isArray(products) &&
            products.map((product, index) => (
              <li key={product._id} className="mb-4 ml-5">
                <h3 className="text-lg font-semibold">
                  {index + 1}. {product.name}
                </h3>
                <p>Quantity: {product.itemsRequired || requiredQuantity}</p>
                <p>Price: {product.price}</p>
                <p className="text-gray-600 text-xl">
                  Total Price:{" "}
                  {product.price * product.itemsRequired ||
                    product.price * requiredQuantity}
                </p>
              </li>
            ))}
        </ul>
      </div>

      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">Payment</h1>
        <div className="w-full p-10">
          {clientToken && products?.length > 0 && (
            <>
              <DropIn
                options={{
                  authorization: clientToken,
                  paypal: {
                    flow: "vault",
                  },
                }}
                onInstance={(instance) => {
                  setInstance(instance);
                }}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:cursor-pointer"
                onClick={handlePayment}
                disabled={loading || !instance}
              >
                {loading ? "Processing..." : "Make Payment"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
