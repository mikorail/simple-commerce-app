// layout/DashboardLayout.tsx
import React from 'react';
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  return (
    <>
      <div className="flex text-gray-500">
        <Sidebar />
        <div className="flex-grow p-4 bg-gray-100">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
