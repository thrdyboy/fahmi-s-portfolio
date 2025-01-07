export interface RegisterData {
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    name?: string;
}

export interface Profile {
    username: string;
    email: string;
    role: string;
    name?: string;
    additionData?: {
        accountId: string;
        avatarUrl: string;
        bio: string;
    } 
}