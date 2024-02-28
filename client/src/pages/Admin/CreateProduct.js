import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Axios from "axios";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    Axios.get(`${process.env.REACT_APP_API}/api/v1/category/all-categories`)
      .then((response) => {
        if (response.data.status) {
          setCategories(response.data.categories);
        } else {
          toast.error("Failed to get categories");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch categories");
      });
  };

  const handleCreateProduct = (e) => {
    const categoryNameToSend = otherCategory ? newCategory : category;
    e.preventDefault();
    Axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, {
      name: name,
      description: description,
      price: price,
      categoryName: categoryNameToSend,
      quantity: quantity,
      image: imageUrl,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setName("");
          setDescription("");
          setPrice("");
          setCategory("");
          setQuantity("");
          setImageUrl("");
          setNewCategory("");
          setOtherCategory(false);
          setSearchTerm("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to create product");
      });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = categories.filter((cat) =>
      cat.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleCategorySelect = (catName) => {
    setCategory(catName);
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen">
      <div>
        <AdminMenu />
      </div>
      <div
        className="flex-1 flex justify-center items-center overflow-y-auto"
        style={{
          backgroundImage: "url(/images/product-bg.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-1/2 border bg-white opacity-90 border-gray-300 rounded p-8 mt-32 mb-10">
          <h1 className="text-2xl font-playfair font-semibold mb-4">
            Create Product
          </h1>
          <form className="font-poppins" onSubmit={handleCreateProduct}>
            <span className="block mb-1">Name</span>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md p-3"
              placeholder="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <span className="mt-3 block mb-1 ">Description</span>
            <textarea
              className="w-full border-gray-300 rounded-md p-3"
              placeholder="Product description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <span className="mt-3 block mb-1">Price</span>
            <input
              type="number"
              className="w-full border-gray-300 rounded-md p-3"
              placeholder="Product Price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <span className="mt-3 block mb-1">Category</span>
            <div className="relative">
              <select
                className="w-full border-gray-300 rounded-md p-3 mt-1"
                value={otherCategory ? "other" : category}
                onChange={(e) => {
                  handleCategorySelect(e.target.value);
                  setOtherCategory(e.target.value === "other");
                }}
              >
                <option value="">Select Category</option>
                {categories
                  .filter((cat) =>
                    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                <option value="other">Other</option>
              </select>
              {otherCategory && (
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-md p-3 mt-2"
                  placeholder="New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              )}
            </div>

            <span className="mt-3 block mb-1">Quantity</span>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md p-3"
              placeholder="Product Quantity"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <span className="mt-3 block mb-1">Image URL</span>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md p-3"
              placeholder="Image URL"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white mr-3 p-2 cursor-pointer rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
