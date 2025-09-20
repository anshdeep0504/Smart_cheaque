
import React, { useMemo } from 'react';
import { Cheque, ChequeStatus } from '../types';
import { Icon } from './Icon';

interface DashboardStatsProps {
    cheques: Cheque[];
}

interface StatCardProps {
    title: string;
    amount: string;
    count: number;
    iconName: 'pending' | 'cleared' | 'bounced';
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, count, iconName, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{amount}</p>
            <p className="text-xs text-gray-400 mt-1">{count} cheques</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
           <Icon name={iconName} className="h-6 w-6 text-white"/>
        </div>
    </div>
);


const DashboardStats: React.FC<DashboardStatsProps> = ({ cheques }) => {
    const stats = useMemo(() => {
        const initialStats = {
            pending: { total: 0, count: 0 },
            cleared: { total: 0, count: 0 },
            bounced: { total: 0, count: 0 },
        };

        return cheques.reduce((acc, cheque) => {
            switch (cheque.status) {
                case ChequeStatus.Pending:
                    acc.pending.total += cheque.amount;
                    acc.pending.count += 1;
                    break;
                case ChequeStatus.Cleared:
                    acc.cleared.total += cheque.amount;
                    acc.cleared.count += 1;
                    break;
                case ChequeStatus.Bounced:
                    acc.bounced.total += cheque.amount;
                    acc.bounced.count += 1;
                    break;
            }
            return acc;
        }, initialStats);
    }, [cheques]);

    const formatCurrency = (amount: number) => {
         return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const frequentBouncers = useMemo(() => {
        const bouncerCounts: { [key: string]: number } = {};
        cheques.forEach(cheque => {
            if (cheque.status === ChequeStatus.Bounced) {
                bouncerCounts[cheque.name] = (bouncerCounts[cheque.name] || 0) + 1;
            }
        });
        return Object.entries(bouncerCounts)
            .filter(([, count]) => count > 1)
            .map(([name]) => name);
    }, [cheques]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Pending Amount" amount={formatCurrency(stats.pending.total)} count={stats.pending.count} iconName="pending" color="bg-yellow-400" />
                <StatCard title="Cleared Amount" amount={formatCurrency(stats.cleared.total)} count={stats.cleared.count} iconName="cleared" color="bg-green-500" />
                <StatCard title="Bounced Amount" amount={formatCurrency(stats.bounced.total)} count={stats.bounced.count} iconName="bounced" color="bg-red-500" />
            </div>
             {frequentBouncers.length > 0 && (
                <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Attention</p>
                    <p>Payers with frequent bounced cheques: {frequentBouncers.join(', ')}</p>
                </div>
            )}
        </div>
    );
};

export default DashboardStats;