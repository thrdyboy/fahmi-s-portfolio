'use client'
import Wrapper from "<prefix>/components/wrapper";
import { useAuth } from "<prefix>/context/userContext";
import Link from "next/link";

export default function Home() {
    const { user, isAuthenticated } = useAuth();  // Access the user context

    return (
        <Wrapper>
            <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Welcome to Web Blog</h1>
                <p className="text-lg text-center text-gray-600 mb-8">Your Story, Your Voice</p>

                {isAuthenticated ? (
                    <div className="text-center">
                        <p className="text-xl text-gray-700 mb-4">Welcome back, <span className="font-semibold text-blue-600">{user.username}</span>!</p>
                        <p className="text-gray-500">Feel free to explore the latest stories.</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-lg text-gray-700 mb-4">You're not logged in yet.</p>
                        <Link href="/login">
                            <p className="text-blue-500 font-semibold hover:underline cursor-pointer">Log In</p>
                        </Link>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
