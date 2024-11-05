// components/Navbar.tsx
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = parseJwt(token);
      setUser({ email: decoded.email });
    }
  }, []);

  const parseJwt = (token: string) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  
    if (!token) return;
  
    try {
      const response = await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Logout failed");
      }
  
      // Remove the token from localStorage and reset user state
      localStorage.removeItem("authToken");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-semibold">
          <Link href="/" className='text-gray-950 font-extrabold'>MyStore</Link>
        </div>
        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <span className="text-gray-700 font-medium">{user.email}</span>
              <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-gray-900 font-medium">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-gray-900">
            {isMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-2 p-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
                <span className="text-gray-700 font-medium">{user.email}</span>
                <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-gray-900 font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
