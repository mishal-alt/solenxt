// src/admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import Sidebar from "./components/Sidebar";
import CountUp from "react-countup";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all"); // all, men, women
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    cat: "",
    stoke: "",
    image: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axiosInstance
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ id: "", name: "", price: "", cat: "", stoke: "", image: "" });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axiosInstance.patch(`/products/${editingProduct.id}`, formData);
      } else {
        await axiosInstance.post(`/products`, formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stoke === 0).length;
  const categories = [...new Set(products.map((p) => p.cat))].length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stoke, 0);

  // ✅ Filter products by search and category
  const filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cat.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) => (filterCategory === "all" ? true : p.cat.toLowerCase() === filterCategory));

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <div className="flex min-h-screen bg-white text-black">
        <Sidebar />
        <div className="flex-1 p-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Products</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Total Products</h2>
              <p className="text-3xl mt-2"><CountUp end={totalProducts} duration={1.5} /></p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Out Of Stocks</h2>
              <p className="text-3xl mt-2"><CountUp end={outOfStock} duration={1.5} /></p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Categories</h2>
              <p className="text-3xl mt-2"><CountUp end={categories} duration={1.5} /></p>
            </div>
            <div className="p-6 bg-black text-white rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">Total Value</h2>
              <p className="text-3xl mt-2">₹<CountUp end={totalValue} duration={1.5} separator="," /></p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 p-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Product Table */}
          <table className="w-full border border-black">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">No.</th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p, index) => (
                <tr key={p.id} className="border-t border-gray-400">
                  <td className="p-3 font-medium">{(currentPage - 1) * productsPerPage + index + 1}</td>
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg border" />
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3 capitalize">{p.cat}</td>
                  <td className="p-3">{p.stoke}</td>
                  <td className="p-3 flex gap-3">
                    <button onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-blue-600 hover:text-white text-black">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-600 hover:text-white text-black">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200 text-black"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
                <h2 className="text-2xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  {/* ID input removed as it is auto-generated */}
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="w-full border p-2 rounded" />
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full border p-2 rounded" />
                  <input type="text" name="cat" value={formData.cat} onChange={handleChange} placeholder="Category" required className="w-full border p-2 rounded" />
                  <input type="number" name="stoke" value={formData.stoke} onChange={handleChange} placeholder="Stock" required className="w-full border p-2 rounded" />
                  <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required className="w-full border p-2 rounded" />
                  <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
