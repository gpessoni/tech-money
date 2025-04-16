export interface Income {
    id: string;
    amount: number;
    description: string;
    date: Date;
    userId: string;
}

export interface ListIncomesResponse {
    data?: Income[];
    error?: string;
    status: number;
}