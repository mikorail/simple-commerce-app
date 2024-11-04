// pages/dashboard/index.tsx
import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import Dashboard from '../components/Dashboard'; // Your dashboard component

const DashboardHome = () => {
    return (
        <DashboardLayout>
            <Dashboard />
        </DashboardLayout>
    );
};

export default DashboardHome;
