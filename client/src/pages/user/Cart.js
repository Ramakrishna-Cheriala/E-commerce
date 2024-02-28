import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import Axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [auth] = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [quantityRequired, setQuantityRequired] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate total price whenever product details change
    const totalPrice = productDetails.reduce((acc, product) => {
      let itemTotalPrice = parseFloat(product.price) * product.itemsRequired;
      return acc + itemTotalPrice;
    }, 0);
    setTotal(totalPrice);
  }, [productDetails]);

  const handleFetchCartItems = () => {
    const id = auth.user.id;
    try {
      Axios.get(`${process.env.REACT_APP_API}/api/v1/cart/cart-items`, {
        params: {
          userId: id,
        },
      })
        .then((response) => {
          if (response.data.status) {
            setProductDetails(response.data.products);
            setQuantityRequired(response.data.products.itemsRequired);
          }
        })
        .catch((error) => {
          toast.error("Error while fetching product details");
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCartItems = () => {
    const userId = auth.user.id;
    try {
      Axios.delete(`${process.env.REACT_APP_API}/api/v1/cart/delete-cart`, {
        params: {
          userId: userId,
        },
      })
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message);
            setProductDetails([]);
          }
        })
        .catch((error) => {
          toast.error("Error while deleting");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = (id) => {
    try {
      const userId = auth.user.id;
      Axios.delete(
        `${process.env.REACT_APP_API}/api/v1/cart/delete-cart-item`,
        {
          params: { userId: userId, productId: id },
        }
      )
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message);
            // window.location.reload();
            setProductDetails((prevProducts) =>
              prevProducts.filter((product) => product._id !== id)
            );
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = productDetails.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4 font-playfair">
        Cart - {productDetails.length} item(s)
      </h1>

      <input
        type="text"
        placeholder="Search by product name"
        className="ml-5 w-1/3 mb-4 px-4 py-2 border border-gray-300 rounded-md"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <div className="flex justify-end">
        <h1 className="text-3xl font-semibold mb-4">
          Total Price - {total} /-
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white shadow-lg p-4 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-4"
              style={{ objectFit: "contain" }}
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">Price: {product.price}</p>
            <p className="text-gray-600">Quantity: {product.itemsRequired}</p>

            <div className="flex justify-end">
              <button
                className="mt-4 mr-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={() => {
                  navigate(`/product-details/${product._id}`);
                }}
              >
                View Details
              </button>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                onClick={() => {
                  handleRemoveFromCart(product._id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end m-5">
        {filteredProducts.length > 0 && (
          <>
            <button
              className="m-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
              onClick={() => {
                navigate("/dashboard/payment", {
                  state: {
                    products: filteredProducts,
                    totalAmount: total,
                    requiredQuantity: 0,
                  },
                });
              }}
            >
              Buy {filteredProducts.length} items
            </button>
            <button
              className="m-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
              onClick={deleteCartItems}
            >
              Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
