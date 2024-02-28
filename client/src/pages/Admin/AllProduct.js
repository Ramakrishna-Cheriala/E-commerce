import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
    getTotal();
  }, [page, selectedCategory]); // Reload products when page or selected category changes

  const handleClick = (id) => {
    navigate(`/admindashboard/product-details/${id}`);
  };

  const fetchAllProducts = () => {
    const queryParams = {
      page,
      category: selectedCategory,
      search: searchTerm,
    };

    Axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-all-products`, {
      params: queryParams,
    })
      .then((response) => {
        if (response.data.status) {
          setProducts(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const getTotal = async () => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      if (response.data.status) {
        setTotal(response.data.total);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  let x = Math.floor(total / 6);

  const loadMoreProducts = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more products:", error);
      toast.error("Failed to fetch more products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = () => {
    Axios.get(`${process.env.REACT_APP_API}/api/v1/category/all-categories`)
      .then((response) => {
        if (response.data.status) {
          setCategories(response.data.categories);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.length >= 3) {
      Axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${searchTerm}`
      ).then((response) => {
        if (response.data.status) {
          console.log("Product searched");
          setProducts(response.data.result);
        } else {
          console.log("no results");
        }
      });
    } else {
      fetchAllProducts();
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset page to 1 when category changes
  };

  const handleBack = () => {
    if (page >= 1) {
      setLoading(true);
      try {
        const nextPage = page - 1;
        setPage(nextPage);
      } catch (error) {
        console.error("Error fetching more products:", error);
        toast.error("Failed to fetch more products");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="w-72">
          <AdminMenu />
        </div>
        <div className="flex-1 p-5">
          <h1 className="text-2xl font-bold">All Product</h1>
          <div className="container mx-auto px-4 py-8">
            <input
              type="text"
              placeholder="Search by product name"
              className="w-1/3 mb-4 px-4 py-2 border border-gray-300 rounded-md"
              onChange={handleSearch}
            />
            <div className="mb-4">
              <span className="mr-2">Filter by category:</span>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto max-h-48 object-cover"
                      style={{ objectFit: "contain" }}
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h2>
                      <p>Price: {product.price}</p>
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                        onClick={() => handleClick(product._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>
            <div className="flex justify-end m-4">
              {products.length < total && (
                <>
                  <button
                    className="mr-2 mt-3 px-4 py-2 bg-gradient-to-r from-slate-500 to-gray-800 text-white rounded-md shadow-md hover:from-gray-800 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    onClick={() => handleBack()}
                  >
                    {loading ? "Loading..." : "Back"}
                  </button>
                  <button
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-slate-500 to-gray-800 text-white rounded-md shadow-md hover:from-gray-800 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    onClick={() => loadMoreProducts()}
                  >
                    {loading ? "Loading..." : "Next"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
