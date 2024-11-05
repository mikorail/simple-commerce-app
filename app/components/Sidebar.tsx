'use client'
// components/Sidebar.tsx
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = parseJwt(token);
            setUserRole(decoded.role); // Assume the role is stored in the token
        }
    }, []);

    const parseJwt = (token: string) => {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    return (
        <div className="w-64 h-screen bg-gray-800 text-white sticky top-0">
            <h2 className="text-2xl font-bold p-4">Dashboard</h2>
            <ul>
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                {/* Show User Management only for ADMIN or SELLER */}
                {(userRole === 'ADMIN' || userRole === 'SELLER') && (
                    <li className="p-4 hover:bg-gray-700">
                        <Link href="/user">User Management</Link>
                    </li>
                )}
                {/* Show Product Management only for ADMIN or SELLER */}
                {(userRole === 'ADMIN' || userRole === 'SELLER') && (
                    <li className="p-4 hover:bg-gray-700">
                        <Link href="/product">Product Management</Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
