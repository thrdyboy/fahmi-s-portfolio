'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import { LoginData } from "<prefix>/types/account";
import { LoginAcc } from "<prefix>/services/accountService";

interface User {
    id: string | null;
    username: string | null;
}

interface AuthContextType {
    user: User;
    login: (dataLogin: LoginData) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>({ id: null, username: null })
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = Cookies.get('authToken')
        if (token) {
            const storedUser = Cookies.get('user')
            if (storedUser) {
                setUser(JSON.parse(storedUser))
                setIsAuthenticated(true)
            }
        }
    }, [])

    const login = async (LoggedData: LoginData) => {
        try {
            const fetchData = await LoginAcc(LoggedData)
            console.log('API Response: ', fetchData)
            if (!fetchData.ok) {
                throw new Error(fetchData.error || 'Invalid Credentials')
            }
            const { token, data } = fetchData.result
            Cookies.set('authToken', token, { secure: true, sameSite: 'strict' })
            Cookies.set('user', JSON.stringify(data), { secure: true, sameSite: 'strict' })

            setUser(data)
            setIsAuthenticated(true)
            return true
        } catch (error: any) {
            console.error('Login Failed: ', error)
            return false
        }
    }

    const logout = () => {
        Cookies.remove('authToken')
        Cookies.remove('user')
        setUser({ id: null, username: null })
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('Authentication must be used on Authentication Provider')
    return context
} 