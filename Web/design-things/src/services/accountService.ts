import axios from "axios";
import { LoginData, Profile, RegisterData } from "<prefix>/types/account";

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

export const getProfile = async () => {
    const validateProfile = (data: Profile) => {
        if (
            typeof data.username === 'string' &&
            (typeof data.name === 'string' || typeof data.name === 'undefined') &&
            typeof data.email === 'string' &&
            typeof data.role === 'string' &&
            (typeof data.additionData === 'undefined' || (
                typeof data.additionData.accountId === 'string' &&
                (typeof data.additionData.avatarUrl === 'string' || typeof data.additionData.avatarUrl === 'undefined') &&
                (typeof data.additionData.bio === 'string' || typeof data.additionData.bio === 'undefined')
            ))
        ) {
            return data as Profile
        } else {
            console.error("Invalid Profile structure:", data)
            return null
        }

    }

    try {
        const response = await axios.get(`${AccountURL}/profile`)
        const ProfileQuery = validateProfile(response.data)
        if (ProfileQuery) {
            return { ok: true, data: { ...ProfileQuery } }
        } else {
            return { ok: false, error: "Invalid Profile Structure"}
        }
    } catch (error: any) {
        console.error('Fetch Account Failed: ', error)
        return { ok: false, error: error.response?.data || 'Failed to fetch the Account'}
    }
}

export const createProfile = async (ProfileData: Partial<Profile>) => {
    const validateProfile = (data: Profile) => {
        if (
            typeof data.username === 'string' &&
            (typeof data.name === 'string' || typeof data.name === 'undefined') &&
            typeof data.email === 'string' &&
            typeof data.role === 'string' &&
            (typeof data.additionData === 'undefined' || (
                typeof data.additionData.accountId === 'string' &&
                (typeof data.additionData.avatarUrl === 'string' || typeof data.additionData.avatarUrl === 'undefined') &&
                (typeof data.additionData.bio === 'string' || typeof data.additionData.bio === 'undefined')
            ))
        ) {
            return data as Profile
        } else {
            console.error("Invalid Profile Structure: ", data)
            return null
        }
    }

    try {
        const response = await axios.post(`${AccountURL}/profile`, ProfileData)
        const ProfileCreated = validateProfile(response.data)
        return { ok: true, data: { ...ProfileCreated } }
    } catch (error: any) {
        console.error("Error creating the Profile: ", error)
        return { ok: false, error: error.response?.data || "Failed to make the Profile" }
    }
}
