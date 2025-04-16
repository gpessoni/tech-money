export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}

export interface ListUsersResponse {
    data?: User[];
    error?: string;
    status: number;
}