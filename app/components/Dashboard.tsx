// components/Dashboard.tsx
import React from 'react';
import Charts from './Charts';
import TopBuyers from './TopBuyers';
import PurchaseList from './PurchaseList';

const Dashboard = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-500">Dashboard</h1>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <Charts />
                </div>
                <div className="flex-1">
                    <TopBuyers />
                </div>
            </div>
            <PurchaseList />
        </div>
    );
};

export default Dashboard;
