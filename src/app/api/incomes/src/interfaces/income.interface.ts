export interface Income {
    id: string;
    amount: number;
    description: string;
    date: Date;
    type: 'SALARY' | 'FREELANCE' | 'INVESTMENT' | 'RENT' | 'OTHER';
    userId: string;
}

export interface ListIncomesResponse {
    data?: Income[];
    error?: string;
    status: number;
}