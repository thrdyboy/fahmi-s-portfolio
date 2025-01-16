import axios from "axios";
import { createProfile, getProfileDataResponse, LoginData, RegisterData } from "<prefix>/types/account";

const AccountURL = process.env.NEXT_PUBLIC_ACCOUNT_API || "http://localhost:8000/api/account"
export const SignUpAcc = async (RegData: RegisterData) => {
    try {
        const response = await axios.post( `${AccountURL}/register`, RegData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })

        return { result: response.data, ok: true }

    } catch (error: any) {
        console.error("Register API Error: ", error)
        return { result: error.response?.data || "An Error Occured", ok: false }
    }
}

export const TokenVerify = async (token: string) => {
    try {
        const response = await axios.post(`${AccountURL}/verify/${token}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
        return { ok: true, data: response.data }
    } catch (error: any) {
        console.error('Error verifying Account: ', error)
        return { ok: false, error: error.response?.data?.message || 'Verification Failed' }
    }
}

export const LoginAcc = async (LoginData: LoginData) => {
    try {
        const response = await axios.post(`${AccountURL}/login`, LoginData, {
            headers: {
                'Content-Type': 'application/json'
            }, 
            withCredentials: true
        })
        return { ok: true, result: response.data }
    } catch (error: any) {
        console.error('Log In Failed: ', error)
        return { ok: false, error: error.response?.data || 'Login Failed'}
    }
}

export const GetProfile = async (token: string): Promise<getProfileDataResponse> => {
    if (!token) {
        console.warn("No token provided, Unable to fetch the Profile")
        throw new Error("Token was invalid")
    }
    try {
        console.log("Token was fetched. Token: ", token)
        const response = await axios.get<getProfileDataResponse>(`${AccountURL}/profile`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }, 
            withCredentials: true
        })
        console.log("Profile Data: ", response.data)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Get Profile Axios error: ", error.response?.data || error.message)
        } else {
            console.error("Unexpected Error: ", error)
        }
        throw error
    }
}

export const CreateProfile = async (dataForm: createProfile, token: string) => {
    try {
        const formData = new FormData()
        formData.append('bio', dataForm.bio)
        if (dataForm.avatarUrl) {
            if (typeof dataForm.avatarUrl === 'string') {
                formData.append('avatarUrl', dataForm.avatarUrl)
                console.log('Using existing avatar URL:', dataForm.avatarUrl);
            } else {
                formData.append('avatar', dataForm.avatarUrl)
            }
        }

        if (token) {
            console.log("Token being Sent: ", token)
            const response = await axios.post(`${AccountURL}/create-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            console.log("Data was Posted Successfully: ", response.data)
            return response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error to post the Data", error.response ? error.response.data : error.message)
        } else {
            console.error("Unexpected Error: ", error)
        }
    }
}