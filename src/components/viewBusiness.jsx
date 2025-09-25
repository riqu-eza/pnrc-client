import { useState, useEffect } from "react";

const ViewBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    contact: "",
    category: {
      selectedCategory: "",
      selectedSubcategory: "",
    },
    location: "",
    selectedCounty: "",
    address: "",
    imageUrls: [],
    products: [],
  });

  // Fetch businesses
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch("/api/business/getall");
      const data = await response.json();
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses", error);
    }
  };

  // Delete a business
  const handleDeleteBusiness = async (id) => {
    try {
      await fetch(`/api/business/delete/${id}`, {
        method: 'DELETE',
      });
      setBusinesses(businesses.filter(business => business._id !== id));
    } catch (error) {
      console.error("Error deleting business", error);
    }
  };

  // Start editing a business
  const startEditing = (business) => {
    setEditingBusiness(business._id);
    setFormData({ ...business });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingBusiness(null);
    setFormData({
      name: "",
      description: "",
      email: "",
      contact: "",
      category: {
        selectedCategory: "",
        selectedSubcategory: "",
      },
      location: "",
      selectedCounty: "",
      address: "",
      imageUrls: [],
      products: [],
    });
  };

  // Update a business
  const handleUpdateBusiness = async (id) => {
    try {
      const response = await fetch(`/api/business/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setEditingBusiness(null);
        fetchBusinesses(); // Fetch updated list
      } else {
        console.error("Error updating business", response.statusText);
      }
    } catch (error) {
      console.error("Error updating business", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      products: updatedProducts,
    });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { productName: "", productPrice: 0, productDescription: "", productImage: [] },
      ],
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      products: updatedProducts,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard - Manage Businesses</h1>
      {businesses.length === 0 ? (
        <p className="text-center text-gray-600">No businesses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <div key={business._id} className="p-4 border rounded shadow-lg">
              {editingBusiness === business._id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Business Name"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Description"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Contact"
                  />
                  <input
                    type="text"
                    name="selectedCategory"
                    value={formData.category.selectedCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: {
                          ...formData.category,
                          selectedCategory: e.target.value,
                        },
                      })
                    }
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    name="selectedSubcategory"
                    value={formData.category.selectedSubcategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: {
                          ...formData.category,
                          selectedSubcategory: e.target.value,
                        },
                      })
                    }
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Subcategory"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    name="selectedCounty"
                    value={formData.selectedCounty}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="County"
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                    placeholder="Address"
                  />
                  <div>
                    <h3 className="text-lg font-bold mb-2">Products</h3>
                    {formData.products.map((product, index) => (
                      <div key={index} className="mb-4 p-2 border rounded bg-gray-50">
                        <input
                          type="text"
                          name="productName"
                          value={product.productName}
                          onChange={(e) => handleProductChange(index, e)}
                          className="border p-2 rounded mb-2 w-full"
                          placeholder="Product Name"
                        />
                        <input
                          type="number"
                          name="productPrice"
                          value={product.productPrice}
                          onChange={(e) => handleProductChange(index, e)}
                          className="border p-2 rounded mb-2 w-full"
                          placeholder="Product Price"
                        />
                        <textarea
                          name="productDescription"
                          value={product.productDescription}
                          onChange={(e) => handleProductChange(index, e)}
                          className="border p-2 rounded mb-2 w-full"
                          placeholder="Product Description"
                        />
                        <input
                          type="text"
                          name="productImage"
                          value={product.productImage.join(", ")}
                          onChange={(e) =>
                            handleProductChange(index, {
                              ...e,
                              target: {
                                ...e.target,
                                value: e.target.value.split(", "),
                              },
                            })
                          }
                          className="border p-2 rounded mb-2 w-full"
                          placeholder="Product Image URLs (comma separated)"
                        />
                        <button
                          onClick={() => removeProduct(index)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                        >
                          Remove Product
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addProduct}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                      Add Product
                    </button>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleUpdateBusiness(business._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold">{business.name}</h2>
                  <p className="text-gray-700 mb-2">{business.description}</p>
                  <p className="text-gray-700 mb-2">{business.email}</p>
                  <p className="text-gray-700 mb-2">{business.contact}</p>
                  {/* Add other business details similarly */}
                  <div>
                    <h3 className="text-lg font-bold mb-2">Products</h3>
                    {business.products.map((product, index) => (
                      <div key={index} className="mb-2 p-2 border rounded bg-gray-50">
                        <p className="text-gray-700">Name: {product.productName}</p>
                        <p className="text-gray-700">Price: {product.productPrice}</p>
                        <p className="text-gray-700">Description: {product.productDescription}</p>
                        <p className="text-gray-700">
                          Images: {product.productImage.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => startEditing(business)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBusiness(business._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBusiness;
