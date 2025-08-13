// src/components/Navbar.js

import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Make sure this path is correct

const Navbar = () => {
    // Get user and logout function from our AuthContext
    const { user, logout } = useContext(AuthContext);
    
    // State to manage the mobile menu's open/closed status
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo/Brand Name */}
                    <div className="flex-shrink-0">
                        <p className="text-2xl font-bold text-gray-900">ExpenseTracker</p>
                    </div>

                    {/* This entire block for menus will only render if a user is logged in */}
                    {user && (
                        <>
                            {/* Desktop Menu */}
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-center space-x-4">
                                    <span className="text-gray-700">
                                        Welcome, <span className="font-semibold">{user.name}</span>
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu Button (Hamburger) */}
                            <div className="-mr-2 flex md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    type="button"
                                    className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-700 hover:text-white focus:outline-none"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {/* Icon swaps based on menu state */}
                                    {isMenuOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {/* It will only render if the menu is open AND a user exists */}
            {user && isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-white shadow-lg">
                         <span className="text-gray-700 block px-3 py-2">
                            Welcome, <span className="font-semibold">{user.name}</span>
                        </span>
                        <button
                            onClick={logout}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

/*
## Key Changes and Logic
Context Integration: It now properly imports useContext and AuthContext and calls const { user, logout } = useContext(AuthContext); to get the current user's data and the logout function.

Conditional Rendering: The entire menu section (both desktop and mobile hamburger button) is wrapped in a {user && ...} block. This ensures that if no user is logged in, only the "ExpenseTracker" brand name is visible, which is the correct behavior for a login-protected app.

State Management: It uses useState to manage the isMenuOpen state for the mobile menu toggle, keeping the component self-contained.

Responsive & Functional: The desktop menu shows for medium screens and up (md:block), while the hamburger icon shows on smaller screens (md:hidden). Both the desktop and mobile logout buttons are now correctly wired to the logout function from our AuthContext.
*/