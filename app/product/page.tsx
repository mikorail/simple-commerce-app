// pages/dashboard/products.tsx
import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import ProductManagement from '../components/ProductManagement';

const ProductPage = () => {
    return (
        <DashboardLayout>
            <ProductManagement />
        </DashboardLayout>
    );
};

export default ProductPage;
