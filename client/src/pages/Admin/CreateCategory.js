import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Axios from "axios";
import { toast } from "react-toastify";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { BiCartAdd } from "react-icons/bi";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, {
      name,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setName("");
          fetchCategories();
        } else {
          toast.error(response.data.message);
          console.log("Incorrect response");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to create category");
      });
  };

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
        console.log(error);
        toast.error("Failed to fetch categories");
      });
  };

  const handleEdit = (id, newName) => {
    Axios.put(
      `${process.env.REACT_APP_API}/api/v1/category/update-category/${id}`,
      {
        name: newName,
        id: id,
      }
    )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          fetchCategories();
          setEditIndex(-1);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update category");
      });
  };

  const handleDelete = (id) => {
    Axios.delete(
      `${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`
    )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          fetchCategories();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete category");
      });
  };

  const [editIndex, setEditIndex] = useState(-1);

  const handleEditClick = (index) => {
    setName(category[index].name);
    setEditIndex(index);
  };

  // Filter categories based on search term
  const filteredCategories = category.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="w-72">
        <AdminMenu />
      </div>
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-semibold font-poppins">Create Category</h1>
        <form className="flex items-center mt-3">
          <input
            type="text"
            placeholder="Search..."
            className="h-12 border-blue-500 rounded-l-md px-4 py-2 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="text-5xl p-2 h-12 bg-blue-500 text-white rounded-r-md cursor-pointer" />
        </form>
        <form className="flex items-center mt-3">
          <input
            type="text"
            placeholder="Add Category..."
            className="h-12 border-blue-500 rounded-l-md px-4 py-2 focus:outline-none"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="text-xl p-2 h-12 bg-blue-500 text-white rounded-r-md"
          >
            Add...
          </button>
        </form>
        <div className="mt-5">
          <h2 className="text-lg font-semibold">Categories:</h2>
          <ul className="grid grid-cols-1 gap-4">
            {filteredCategories.map((cat, index) => (
              <li key={cat._id}>
                <div className="bg-white shadow-md rounded-md p-4 flex items-center justify-between">
                  {editIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={name}
                        placeholder="Enter new category"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEdit(cat._id, name)}
                        >
                          Save
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => setEditIndex(-1)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>
                        {index + 1}. {cat.name}
                      </span>
                      <div className="flex gap-2 text-xl">
                        <MdEdit
                          title="Edit"
                          className="text-3xl cursor-pointer icon rounded-full p-1 bg-gray-200 hover:bg-gray-300 transition duration-300"
                          onClick={() => handleEditClick(index)}
                        />
                        <MdDelete
                          title="Delete"
                          className="text-3xl cursor-pointer icon rounded-full p-1 bg-gray-200 hover:bg-gray-300 transition duration-300"
                          onClick={() => handleDelete(cat._id)}
                        />
                        {/* <a
                          href={`/admindashboard/create-product?category=${cat.name}&categoryId=${cat._id}`}
                        >
                          <BiCartAdd
                            title="Add Item"
                            className="text-3xl cursor-pointer icon rounded-full p-1 bg-gray-200 hover:bg-gray-300 transition duration-300"
                          />
                        </a> */}
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
