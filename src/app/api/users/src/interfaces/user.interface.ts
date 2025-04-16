export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}

export interface UserWithoutPassowrd {
    id: string;
    email: string;
    name: string;
}

export interface ListUsersResponse {
    data?: UserWithoutPassowrd[];
    error?: string;
    status: number;
}