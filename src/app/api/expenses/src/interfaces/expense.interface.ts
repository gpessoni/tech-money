export interface Expense {
    id: string;
    amount: number;
    category: 'ALIMENTACAO' | 'TRANSPORTE' | 'SAUDE' | 'EDUCACAO' | 'MORADIA' | 'LAZER' | 'VESTUARIO' | 'SERVICOS' | 'IMPOSTOS' | 'SEGUROS' | 'PRESENTES' | 'VIAGENS' | 'OUTROS';
    description: string;
    date: Date;
    userId: string;
}

export interface ListExpensesResponse {
    data?: Expense[];
    error?: string;
    status: number;
}