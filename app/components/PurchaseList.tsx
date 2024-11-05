// components/PurchaseList.tsx
'use client';
import React, { useEffect, useState } from 'react';

interface PurchaseLists {
  uuid: string;
  name: string;
  email: string;
  count: number;  // Assuming this may be utilized later
  price: number;
  quantity: number;
  purchase_date: string;
  status: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_COMMERCE_API_URL || "http://localhost:4000/api"; // Ensure correct environment variable

const PurchaseList: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseLists[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(''); // For filtering purchases
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20; // Number of items per page

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch(`${API_URL}/purchase`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setPurchases(result.data); // Ensure result.data is formatted correctly
      } catch (err) {
        setError('Failed to fetch purchases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Filter purchases based on the filter state
  const filteredPurchases = purchases.filter(purchase =>
    purchase.uuid.toLowerCase().includes(filter.toLowerCase()) || // Filter by Transaction ID
    purchase.name.toLowerCase().includes(filter.toLowerCase()) || // Filter by Product Name
    purchase.email.toLowerCase().includes(filter.toLowerCase())    // Filter by Buyer Email
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIndex, endIndex);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Purchase List</h2>
      
      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by Product Name or Email"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {filteredPurchases.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Purchase Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPurchases.map((purchase) => (
                <tr key={purchase.uuid} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{purchase.uuid}</td>
                  <td className="border px-4 py-2">{purchase.name}</td>
                  <td className="border px-4 py-2">{purchase.email}</td>
                  <td className="border px-4 py-2">{purchase.quantity}</td>
                  <td className="border px-4 py-2">${purchase.price.toFixed(2)}</td>
                  <td className="border px-4 py-2">{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{purchase.status ? 'Completed' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No purchases found.</p>
      )}
    </div>
  );
};

export default PurchaseList;
