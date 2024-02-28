import React, { useEffect, useState } from "react";
import { Await, useNavigate, useParams } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import Axios from "axios";
import { toast } from "react-toastify";

const ProductById = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      Axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
        {
          description: description,
          price: price,
          quantity: quantity,
        }
      ).then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setDescription(response.data.updatedProductDetails.description);
          setPrice(response.data.updatedProductDetails.price);
          setQuantity(response.data.updatedProductDetails.quantity);
        } else {
          toast.error(response.data.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    Axios.delete(
      `${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`
    ).then((response) => {
      if (response.data.status) {
        toast.success(response.data.message);
        navigate("/admindashboard/all-product");
      } else {
        toast.error(response.data.message);
      }
    });
  };

  const handleCancel = () => {
    // Reset input fields to their original values
    setDescription(productDetails.description);
    setPrice(productDetails.price);
    setQuantity(productDetails.quantity);
    setImageUrl(productDetails.image);
    setIsEditing(false);
  };

  return (
    <div className="flex">
      <div className="w-72">
        <AdminMenu />
      </div>
      <div className="flex-1 p-5 flex items-center">
        <div className="w-1/2 flex justify-center">
          {isEditing ? (
            <>
              <span className="mt-3 block mb-1">Image URL</span>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md p-3"
                placeholder="Image URL"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </>
          ) : (
            <>
              <img
                src={imageUrl}
                alt={productDetails.name}
                className=" w-1/2 h-full object-cover"
              />
            </>
          )}
        </div>
        <div className="w-1/2 ml-8">
          <h1 className="text-2xl font-bold">{productDetails.name}</h1>
          <span className="mt-3 block mb-1 font-semibold">Category</span>
          <h1 className="text-xl">{categoryName}</h1>
          {isEditing ? (
            <>
              <span className="mt-3 block mb-1">Description</span>
              <textarea
                className="w-full border-gray-300 rounded-md p-3"
                placeholder="Product description"
                required
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <span className="mt-3 block mb-1">Price</span>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md p-3"
                placeholder="Product Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span className="mt-3 block mb-1">Quantity</span>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md p-3"
                placeholder="Product Quantity"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white mr-3 p-2 cursor-pointer rounded-md"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white p-2 cursor-pointer rounded-md"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="mt-3 block mb-1 font-semibold">Description</span>
              {/* {productDetails.description &&
                productDetails.description
                  .split("\n")
                  .map((sentence, index) => (
                    <p key={index} className="text-sm">
                      {sentence}
                    </p>
                  ))} */}
              <p className="text-base">{description}</p>
              <span className="mt-3 block mb-1 font-semibold">Price</span>
              <p className="text-lg">{price}</p>
              <span className="mt-3 block mb-1 font-semibold">Quantity</span>
              <p className="text-lg">{quantity}</p>
              <div className="flex justify-end m-4">
                <button
                  className="bg-gray-700 text-white p-2 cursor-pointer rounded-md"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 ml-3 text-white p-2 cursor-pointer rounded-md"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductById;
