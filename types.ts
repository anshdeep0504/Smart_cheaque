export enum ChequeStatus {
    Pending = 'Pending',
    Cleared = 'Cleared',
    Bounced = 'Bounced',
}

export type FilterStatus = ChequeStatus | 'all';

export interface Cheque {
    id: string;
    name: string; // Payer/Payee name
    chequeNumber: string;
    amount: number;
    date: string; // YYYY-MM-DD
    status: ChequeStatus;
    image?: string; 
}

export interface ExtractedChequeData {
    name: string;
    chequeNumber: string;
    amount: number;
    date: string; // YYYY-MM-DD
}
