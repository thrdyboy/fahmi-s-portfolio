'use client'

import { useAuth } from "<prefix>/context/userContext";  // Use the auth context
import Link from "next/link";
import { useState } from "react";

export function NavigationBar() {
    const { user, logout, isAuthenticated } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="z-40 px-2 shadow bg-gradient-to-r from-emerald-500 via-indigo-500 to-yellow-400 sticky top-0">
            <div className="relative mx-auto flex max-w-screen-lg flex-col py-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center text-2xl font-black">
                    <span className="mr-2 text-2xl text-white">📖</span>
                    <span className="text-white text-xl font-semibold">Story Blog For All</span>
                </div>
                <input className="peer hidden" type="checkbox" id="navbar-open" />
                <label className="absolute right-0 mt-1 cursor-pointer text-xl sm:hidden" htmlFor="navbar-open">
                    <span className="sr-only">Toggle Navigation</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z" />
                    </svg>
                </label>
                <nav aria-label="Header Navigation" className="peer-checked:block hidden pl-2 py-6 sm:block sm:py-0">
                    <ul className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8">

                        <li><Link className="text-white hover:scale-110" href="/">Home</Link></li>
                        <li><Link className="text-white hover:scale-110" href="/story-book">Story Book</Link></li>
                        <li><Link className="text-white hover:scale-110" href="/about">About Story Blog For All</Link></li>

                        {isAuthenticated ? (
                            <div className="flex gap-4">

                                <li className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="text-white hover:scale-110"
                                    >
                                        {user.username}
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md py-2">
                                            <Link
                                                href={`/profile/${user.username}`}
                                                className="block px-4 py-2 hover:bg-blue-600 hover:text-white"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="block px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </li>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <li><Link className="rounded-xl border-2 border-white px-6 py-2 font-medium text-white hover:bg-blue-600 hover:text-white" href="/login">Login</Link></li>
                                <li><Link className="rounded-xl border-2 border-white px-6 py-2 font-medium text-white hover:bg-blue-600 hover:text-white" href="/register">Sign Up</Link></li>
                            </div>
                        )}
                    </ul>
                </nav>
            </div>
        </nav>
    );
}
