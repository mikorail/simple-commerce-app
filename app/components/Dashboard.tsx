// components/Dashboard.tsx
import React from 'react';
import Charts from './Charts'

const Dashboard = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-500">Dashboard</h1>
            <Charts />
        </div>
    );
};

export default Dashboard;
