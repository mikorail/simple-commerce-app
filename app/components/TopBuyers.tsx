"use client";
import React, { useEffect, useState } from "react";

const TopPurchasers: React.FC = () => {
  const [topPurchasers, setTopPurchasers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL =
    process.env.NEXT_BASE_COMMERCE_API_URL || "http://localhost:4000/api/";

  useEffect(() => {
    const fetchTopPurchasers = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/purchase/top-purchasers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json", // Specify the content type
          },
        });

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json(); // Parse the JSON response
        if (data.status === "success") {
          setTopPurchasers(data.data); // Update state with fetched data
        } else {
          throw new Error(data.message || "Failed to fetch top purchasers");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch top purchasers"); // Set error message
      } finally {
        setLoading(false); // Set loading to false at the end
      }
    };

    fetchTopPurchasers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Top Purchasers</h2>
      {topPurchasers.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Purchase Count</th>
              <th className="px-2 py-1">Total Spend</th>
              <th className="px-2 py-1">Average Spend</th>
            </tr>
          </thead>
          <tbody>
            {topPurchasers.map((purchaser, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{purchaser.email}</td>
                <td className="border px-2 py-1">{purchaser.count}</td>
                <td className="border px-2 py-1">
                  ${purchaser.totalspend.toFixed(2)}
                </td>
                <td className="border px-2 py-1">
                  ${purchaser.avgspend.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm">No top purchasers found.</p>
      )}
    </div>
  );
};

export default TopPurchasers;
