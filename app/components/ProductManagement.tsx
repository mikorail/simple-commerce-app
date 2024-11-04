"use client";
import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  ProductOwnerId: string | null; // Change to reflect the actual type
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/products/";

  // Function to parse JWT and extract payload
  function parseJwt(token: string) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

      if (!token) {
        setError("You must be logged in to manage products.");
        return;
      }

      // Decode the token to extract user email and role
      let userEmail = '';
      let userRole = '';
      try {
        const decoded = parseJwt(token);
        userEmail = decoded.userEmail; // Accessing the email from decoded token
        userRole = decoded.role; // Accessing the role from decoded token
      } catch (err) {
        setError("Failed to decode token.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}?limit=1000`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Check user role and filter products accordingly
        let userProducts;
        if (userRole === 'admin' || userRole === 'ADMIN') {
          userProducts = data.data.products; // Access products array directly
        } else {
          userProducts = data.data.products.filter((product: Product) => product.ProductOwnerId === userEmail);
        }

        setProducts(userProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const token = localStorage.getItem('authToken'); // Retrieve the token again

    try {
      const response = await fetch(`${API_URL}${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the product');
      }

      // Remove the deleted product from the state
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while deleting.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken'); // Retrieve the token again

    if (!editProduct) return;

    try {
      const response = await fetch(`${API_URL}${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editProduct.name,
          description: editProduct.description,
          price: editProduct.price,
          stock: editProduct.stock,
          category: editProduct.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === updatedProduct.data.id ? updatedProduct.data : product))
      );
      setEditProduct(null); // Reset edit product state
      setIsEditModalOpen(false); // Close edit modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while updating the product.');
    }
  };

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken'); // Retrieve the token again

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          stock: newProduct.stock,
          category: newProduct.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const addedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, addedProduct.data]);
      setNewProduct({}); // Reset form state
      setIsAddModalOpen(false); // Close modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while adding the product.');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Product Management</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button 
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Product
      </button>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">Product ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price.toFixed(2)}</td>
                <td className="border p-2">{product.stock}</td>
                <td className="border p-2">
                  <button className="text-blue-500 mr-2" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="text-red-500" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border p-2 text-center">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Adding Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="border w-full p-2"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  required
                  className="border w-full p-2"
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  required
                  className="border w-full p-2"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Stock</label>
                <input
                  type="number"
                  required
                  className="border w-full p-2"
                  value={newProduct.stock || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  required
                  className="border w-full p-2"
                  value={newProduct.category || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
              </div>
              <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
                Add Product
              </button>
              <button 
                type="button"
                className="text-red-500 ml-2"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Product */}
      {isEditModalOpen && editProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleEditProduct}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="border w-full p-2"
                  value={editProduct.name || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  required
                  className="border w-full p-2"
                  value={editProduct.description || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  required
                  className="border w-full p-2"
                  value={editProduct.price || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Stock</label>
                <input
                  type="number"
                  required
                  className="border w-full p-2"
                  value={editProduct.stock || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  required
                  className="border w-full p-2"
                  value={editProduct.category || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Update Product
              </button>
              <button 
                type="button"
                className="text-red-500 ml-2"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditProduct(null); // Reset edit product state
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
