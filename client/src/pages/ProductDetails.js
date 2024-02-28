import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";

const ProductDetails = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [addToCart, setAddToCart] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [reqQuantity, setReqQuantity] = useState(1);
  const navigate = useNavigate();
  const [auth] = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchProductDetails();
    fetchIsInCart();
  }, []);

  const fetchProductDetails = () => {
    Axios.get(
      `${process.env.REACT_APP_API}/api/v1/product/product-details/${id}`
    )
      .then((response) => {
        if (response.data.status) {
          setProductDetails(response.data.productDetails);
          setCategoryName(response.data.categoryName);
          setDescription(response.data.productDetails.description);
          setPrice(response.data.productDetails.price);
          setQuantity(response.data.productDetails.quantity);
          setImageUrl(response.data.productDetails.image);
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  };

  const fetchIsInCart = () => {
    if (auth.user) {
      const userId = auth.user.id;
      Axios.get(`${process.env.REACT_APP_API}/api/v1/cart/is-in-cart`, {
        params: {
          userId: userId,
          productId: id,
        },
      }).then((response) => {
        if (response.data.status) {
          setAddToCart(true);
        } else {
          setAddToCart(false);
        }
      });
    } else {
      setAddToCart(false);
    }
  };

  const handleAddToCart = () => {
    if (!auth.user) {
      navigate("/login", {
        state: location.pathname,
      });
    } else {
      const userId = auth.user.id;
      console.log(reqQuantity + ": " + parseInt(productDetails.quantity));
      if (reqQuantity > parseInt(productDetails.quantity)) {
        toast.error("Requested quantity exceeds available stock.");
        return;
      }
      Axios.post(`${process.env.REACT_APP_API}/api/v1/cart/add-to-cart/`, {
        userId: userId,
        productId: id,
        reqItems: reqQuantity,
      })
        .then((response) => {
          const { status, message } = response.data;
          if (status) {
            toast.success(message);
            setAddToCart(true);
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add product to cart");
        });
    }
  };

  const handleRemoveFromCart = () => {
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
            setAddToCart(false);
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

  return (
    <div className="flex flex-col md:flex-row mt-5">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={imageUrl}
          alt={productDetails.name}
          className="w-3/5 h-full object-cove object-cover rounded-lg shadow-lg"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Details Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8 py-4">
        <h1 className="text-3xl font-bold mb-4">{productDetails.name}</h1>

        <div className="mb-4">
          <span className="block mb-1 font-semibold">Category</span>
          <h2 className="text-lg">{categoryName}</h2>
        </div>

        <div className="mb-4">
          <span className="block mb-1 font-semibold">Description</span>
          <p className="text-base">{description}</p>
        </div>

        <div className="mb-4">
          <span className="block mb-1 font-semibold">Price</span>
          <p className="text-lg">{price}</p>
        </div>

        <div className="mb-4">
          <span className="block mb-1 font-semibold">In Stock</span>
          <p className="text-lg">{quantity}</p>
        </div>

        <input
          type="number"
          value={reqQuantity}
          min="1"
          max={quantity}
          onChange={(e) => {
            setReqQuantity(e.target.value);
          }}
          className="m-3 w-1/2"
        />

        <div className="flex justify-end">
          {addToCart ? (
            <>
              <button
                className="bg-blue-700 text-white py-2 px-6 rounded-md mr-2 hover:bg-blue-800 transition duration-300"
                onClick={() => navigate("/dashboard/cart")}
              >
                View Cart
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-gray-700 text-white py-2 px-6 rounded-md mr-2 hover:bg-gray-800 transition duration-300"
                onClick={() => {
                  handleAddToCart();
                }}
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
