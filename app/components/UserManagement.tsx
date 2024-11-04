// components/UserManagement.tsx
"use client";
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_BASE_COMMERCE_API_URL || "http://localhost:4000/api/users/";

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('authToken');
      console.log("token:",token ) // Retrieve the token from localStorage
      if (!token) {
        setError("You must be logged in to view users.");
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.data); // Assuming the user data is within data.data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    };

    fetchUsers();
  }, [API_URL]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">User Management</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  <button className="text-blue-500 hover:underline">Edit</button> | 
                  <button className="text-red-500 hover:underline"> Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-2 text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
