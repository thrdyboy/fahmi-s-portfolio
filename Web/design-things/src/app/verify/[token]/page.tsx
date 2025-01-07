'use client'
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { TokenVerify } from "<prefix>/services/accountService";
import Wrapper from "<prefix>/components/wrapper";

export default function VerifyToken() {
    const router = useRouter()
    const params = useParams()

    const token = Array.isArray(params?.token) ? params.token[0] : params?.token

    const VerifyingAccount = async () => {
        if (!token) return

        const { data, ok } = await TokenVerify(token)
        if (ok) {
            toast.success('Verification Success, please login')
            router.push('/login')
            const deleteCookies = Cookies.remove('authToken')
            const deleteCacheUser = Cookies.remove('user')
            return { deleteCookies, deleteCacheUser }
        } else {
            toast.error('Invalid Token or Expired')
            router.push('/')
        }
    }

    useEffect(() => {
        VerifyingAccount()
    })

    return (
        <Wrapper>
            <p>Verification In progress.....</p>
        </Wrapper>
    )
}