'use client'

import Wrapper from "<prefix>/components/wrapper"
import { useAuth } from "<prefix>/context/userContext"
import { GetProfile } from "<prefix>/services/accountService"
import { ProfileData } from "<prefix>/types/account"
import Cookies from "js-cookie"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth()
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('authToken')
            console.log("Retrieved Token: ", token)
            if (!isAuthenticated) {
                setError("User is not Authenticated")
                return
            }
            try {
                const response = await GetProfile(token as string)
                setProfileData(response.data)
                toast.success("Profile was Fetched")
            } catch (error) {
                toast.error("Error to View the Data")
                setError("Failed to Fetch the Data")
                console.error("Error to Fetch the Data: ", error)
            }
        }
        fetchData()
    }, [])

    if (error) {
        return <Wrapper><div>Error: {error}</div></Wrapper>
    }

    return (
        <Wrapper>
            <div className="flex flex-col items-center justify-center py-10 min-h-screen">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        User Profile for {user?.username || "Guest"}
                    </h1>

                    <div className="flex items-center justify-center mb-4">
                        <Image
                            src={profileData?.avatarUrl || '/default-profile.png'}
                            alt="Profile Picture"
                            width={100}
                            height={100}
                            className="rounded-full border-2 border-gray-200"
                        />
                    </div>

                    <div className="space-y-4 text-center">
                        <p className="text-gray-600">
                            <span className="font-semibold">Bio:</span>{" "}
                            {profileData?.bio || "Bio is not Defined Yet."}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Role:</span>{" "}
                            {user?.role || "Role is not Defined Yet."}
                        </p>
                    </div>

                    <div className="flex justify-center mt-6 space-x-4">
                        <Link href={'/'} passHref>
                            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-fuchsia-400 focus:ring focus:ring-violet-400">
                                Back to Home Page
                            </button>                        
                        </Link>
                        <Link href={'/profile/edit'} passHref>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300">
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}