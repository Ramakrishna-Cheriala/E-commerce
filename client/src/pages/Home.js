import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import slugify from "slugify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
    getTotal();
  }, []);

  const fetchCategories = () => {
    Axios.get(`${process.env.REACT_APP_API}/api/v1/category/all-categories`)
      .then((response) => {
        if (response.data.status) {
          setCategory(response.data.categories);
        } else {
          toast.error("Failed to get categories");
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      });
  };

  const fetchAllProducts = () => {
    Axios.get(
      `${process.env.REACT_APP_API}/api/v1/product/get-all-products?page=1&limit=6`
    )
      .then((response) => {
        if (response.data.status) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      });
  };

  const fetchProductsByCategory = (category) => {
    const slugCat = slugify(category);
    Axios.get(
      `${process.env.REACT_APP_API}/api/v1/product/get-products-by-category/${slugCat}`
    )
      .then((response) => {
        if (response.data.status) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } else {
          setProducts([]);
          setFilteredProducts([]);
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching products by category:", error);
        toast.error("Failed to fetch products");
      });
  };

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.length >= 3) {
      Axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${searchTerm}`
      ).then((response) => {
        if (response.data.status) {
          console.log("Product searched");
          setFilteredProducts(response.data.result);
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
    if (event.target.value === "All") {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(event.target.value);
    }
  };

  const handlePriceChange = (event) => {
    setSelectedPrice(event.target.value);
    let minPrice = 0;
    let maxPrice = Infinity;

    switch (event.target.value) {
      case "0-999":
        maxPrice = 999;
        break;
      case "1000-4999":
        minPrice = 1000;
        maxPrice = 4999;
        break;
      case "5000-9999":
        minPrice = 5000;
        maxPrice = 9999;
        break;
      case "10000 and more":
        minPrice = 10000;
        break;
      default:
        break;
    }

    const filteredProducts = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    setFilteredProducts(filteredProducts);
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
      const response = await Axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${nextPage}`
      );
      if (response.data.status) {
        const newProducts = response.data.products;
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setFilteredProducts((prevFilteredProducts) => [
          ...prevFilteredProducts,
          ...newProducts,
        ]);
        setPage(nextPage);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
      toast.error("Failed to fetch more products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div>
          <input
            type="text"
            placeholder="Search by product name or price"
            className="w-1/3 mb-4 px-4 py-2 border border-gray-300 rounded-md"
            onChange={handleSearch}
          />
          <div className="mb-4">
            <span className="mr-2">Filter by category: </span>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="All">All</option>
              {category.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <span className="mr-2">Filter by price:</span>
            <select
              value={selectedPrice}
              onChange={handlePriceChange}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="All">All</option>
              <option value="0-999">0-999</option>
              <option value="1000-4999">1000-4999</option>
              <option value="5000-9999">5000-9999</option>
              <option value="10000 and more">10000 and more</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p>Price: {product.price}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={() => {
                      navigate(`/product-details/${product._id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No products found.</div>
          )}
        </div>
        <div className="flex justify-end m-4">
          {filteredProducts.length < total && (
            <button
              className="mt-3 px-4 py-2 bg-gradient-to-r from-slate-500 to-gray-800 text-white rounded-md shadow-md hover:from-gray-800 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={() => loadMoreProducts()}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
