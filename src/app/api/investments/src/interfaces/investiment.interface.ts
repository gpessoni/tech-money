export interface Investment {
    id: string;
    name: string;
    amount: number;
    yield: number;
    category: string;
    userId: string;
}

export interface ListInvestmentsResponse {
    data?: Investment[];
    error?: string;
    status: number;
}