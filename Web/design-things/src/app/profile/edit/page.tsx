'use client'

import CreateProfileComponent from "<prefix>/components/profileForm/dataProfileForm"
import Wrapper from "<prefix>/components/wrapper"
import { useAuth } from "<prefix>/context/userContext"

export default function CreateProfilePage() {
    const { user, isAuthenticated } = useAuth()
    if (!user || !isAuthenticated) {
        return (
            <Wrapper>
                <p className="text-red-500 text-justify">You must be logged in to create a profile.</p>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <div className="max-w-md mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Create Profile for <span className="text-blue-600">{user?.username}</span></h1>
                <CreateProfileComponent />
            </div>
        </Wrapper>
    )
}