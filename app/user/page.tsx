// pages/dashboard/users.tsx
import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import UserManagement from '../components/UserManagement';

const UserPage = () => {
    return (
        <DashboardLayout>
            <UserManagement />
        </DashboardLayout>
    );
};

export default UserPage;
