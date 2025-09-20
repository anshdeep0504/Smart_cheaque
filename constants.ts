
import { Cheque, ChequeStatus } from './types';

const today = new Date();
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const sampleCheques: Cheque[] = [
    {
        id: '1',
        name: 'ABC Corp',
        chequeNumber: '123456',
        amount: 50000,
        date: formatDate(new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
        status: ChequeStatus.Cleared,
    },
    {
        id: '2',
        name: 'XYZ Solutions',
        chequeNumber: '789012',
        amount: 75000,
        date: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
        status: ChequeStatus.Pending,
    },
    {
        id: '3',
        name: 'Innovate LLC',
        chequeNumber: '345678',
        amount: 25000,
        date: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
        status: ChequeStatus.Bounced,
    },
    {
        id: '4',
        name: 'Tech Giants Inc.',
        chequeNumber: '901234',
        amount: 120000,
        date: formatDate(today), // today
        status: ChequeStatus.Pending,
    },
    {
        id: '5',
        name: 'ABC Corp',
        chequeNumber: '567890',
        amount: 30000,
        date: formatDate(new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)), // 20 days ago
        status: ChequeStatus.Bounced,
    },
    {
        id: '6',
        name: 'Global Exports',
        chequeNumber: '112233',
        amount: 85000,
        date: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
        status: ChequeStatus.Cleared,
    },
     {
        id: '7',
        name: 'Fast Logistics',
        chequeNumber: '445566',
        amount: 45000,
        date: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), // 2 days from now
        status: ChequeStatus.Pending,
    },
];
