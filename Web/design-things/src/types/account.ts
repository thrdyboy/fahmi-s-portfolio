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

export enum AccountRole {
    Author = 'author',
    User = 'user'
}

export interface ProfileData {
    bio: string | null;
    avatarUrl: string | null;
}

export interface getProfileDataResponse {
    data: ProfileData;
}

export interface createProfile {
    bio: string;
    avatarUrl?: File | string;
}