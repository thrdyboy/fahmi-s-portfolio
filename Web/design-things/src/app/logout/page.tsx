'use client'
import Wrapper from "<prefix>/components/wrapper";
import { useAuth } from "<prefix>/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    const { logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        logout()
        router.push('/login')
    }, [])

    return (
        <Wrapper>
            <p>Logging you Out.......</p>
        </Wrapper>
    )
}