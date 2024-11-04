// components/Sidebar.tsx
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white sticky top-0">
            <h2 className="text-2xl font-bold p-4">Dashboard</h2>
            <ul>
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/user">User Management</Link>
                </li>
                <li className="p-4 hover:bg-gray-700">
                    <Link href="/product">Product Management</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
