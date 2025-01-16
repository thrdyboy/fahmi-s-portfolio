'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "<prefix>/context/userContext"

const Lsidebar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 p-2 text-fuchsia-700"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-100 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex justify-end p-4">
                    <h2 className="font-semibold text-gray-700 text-right">Menu</h2>
                </div>

                {isAuthenticated ? (
                    <div className="flex flex-col items-center p-4 bg-blue-100">
                        <p className="text-lg font-semibold text-gray-800">Welcome, <span className="font-semibold text-blue-700">{user?.username}</span></p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center p-4 bg-blue-100">
                        <p className="text-lg font-semibold text-violet-500">Log In to Access the Story</p>
                    </div>
                )}

                <ul className="flex flex-col p-4 space-y-4">
                    <li><Link className="text-gray-700 hover:text-blue-500" href="/">Home</Link></li>
                    <li><Link className="text-gray-700 hover:text-blue-500" href="/story-book">Story Book</Link></li>
                    <li><Link className="text-gray-700 hover:text-blue-500" href="/about">About Story Blog For All</Link></li>

                    {isAuthenticated ? (
                        <div>
                            <li>
                                <Link
                                    href={`/profile`}
                                    className="block text-gray-700 hover:bg-blue-600 hover:text-white rounded-md p-2"
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link href={'/login'}>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left text-red-600 hover:bg-red-600 hover:text-white rounded-md p-2"
                                    >
                                        Logout
                                    </button>
                                </Link>
                            </li>
                        </div>
                    ) : (
                        <ul>
                            <li><Link className="block text-center bg-blue-600 text-white rounded-xl p-2" href="/login">Login</Link></li>
                            <li><Link className="block text-center bg-green-600 text-white rounded-xl p-2 mt-2" href="/register">Sign Up</Link></li>
                        </ul>
                    )}
                </ul>
            </div>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-transparent z-30"
                ></div>
            )}

        </>
    )
}

export default Lsidebar