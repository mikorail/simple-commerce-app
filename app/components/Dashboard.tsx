'use client'
// components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import Charts from './Charts';
import TopBuyers from './TopBuyers';
import PurchaseList from './PurchaseList';

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = parseJwt(token);
      setUserRole(decoded.role); // Assume role is stored in the token
    }
  }, []);

  const parseJwt = (token: string) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-500">Dashboard</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4">
        {userRole !== 'CUSTOMER' && (
          <>
            <div className="flex-1">
              <Charts />
            </div>
            <div className="flex-1">
              <TopBuyers />
            </div>
          </>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Your Purchase List</h2>
        <PurchaseList />
      </div>
    </div>
  );
};

export default Dashboard;
