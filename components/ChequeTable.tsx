import React from 'react';
import { Cheque, ChequeStatus, FilterStatus } from '../types';
import { Icon } from './Icon';

interface ChequeTableProps {
    cheques: Cheque[];
    updateChequeStatus: (id: string, status: ChequeStatus) => void;
    onViewImage: (imageUrl: string) => void;
    filterStatus: FilterStatus;
    setFilterStatus: (status: FilterStatus) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
}

const statusColors: { [key in ChequeStatus]: string } = {
    [ChequeStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [ChequeStatus.Cleared]: 'bg-green-100 text-green-800',
    [ChequeStatus.Bounced]: 'bg-red-100 text-red-800',
};

const ChequeRow: React.FC<{ cheque: Cheque; updateChequeStatus: (id: string, status: ChequeStatus) => void; onViewImage: (imageUrl: string) => void; }> = ({ cheque, updateChequeStatus, onViewImage }) => {
    const isFinalState = cheque.status === ChequeStatus.Cleared || cheque.status === ChequeStatus.Bounced;

    // Set time to 00:00:00 for accurate date-only comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Appending T00:00:00 avoids timezone-related date shifts during parsing
    const chequeDate = new Date(cheque.date + 'T00:00:00');

    const isOverdue = chequeDate < today && cheque.status === ChequeStatus.Pending;
    
    const isDueSoon = (() => {
        if (cheque.status !== ChequeStatus.Pending) return false;
        const diff = chequeDate.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        // A cheque is due soon if it's due today or in the next 7 days.
        return days >= 0 && days <= 7;
    })();


    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4">
                <p className="font-semibold text-gray-900">{cheque.name}</p>
                <p className="text-xs text-gray-500">{cheque.chequeNumber}</p>
            </td>
            <td className="py-3 px-4 font-mono text-right text-gray-800 font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cheque.amount)}</td>
            <td className="py-3 px-4 text-gray-600">{new Date(cheque.date).toLocaleDateString('en-IN')}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[cheque.status]}`}>
                    {cheque.status}
                </span>
            </td>
            <td className="py-3 px-4 text-center">
                {isOverdue && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Overdue
                    </span>
                )}
                {isDueSoon && (
                     <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Due Soon
                    </span>
                )}
            </td>
            <td className="py-3 px-4 text-center">
                {cheque.image && (
                    <button onClick={() => onViewImage(cheque.image!)} className="text-gray-500 hover:text-brand-primary" title="View Attachment">
                        <Icon name="paperclip" className="h-5 w-5" />
                    </button>
                )}
            </td>
            <td className="py-3 px-4">
                 {isFinalState ? (
                    <div className="text-sm text-gray-500 italic px-2">No actions</div>
                 ) : (
                    <div className="relative">
                        <select
                            value={cheque.status}
                            onChange={(e) => updateChequeStatus(cheque.id, e.target.value as ChequeStatus)}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-sm appearance-none pr-8"
                        >
                            <option className="bg-white text-black" value={ChequeStatus.Pending}>Pending</option>
                            <option 
                                className="bg-white text-black disabled:text-gray-400"
                                value={ChequeStatus.Cleared} 
                                disabled={isOverdue}
                                title={isOverdue ? "An overdue cheque cannot be marked as Cleared." : ""}
                            >
                                Cleared
                            </option>
                            <option className="bg-white text-black" value={ChequeStatus.Bounced}>Bounced</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <Icon name="chevron-down" className="h-4 w-4" />
                        </div>
                    </div>
                 )}
            </td>
        </tr>
    );
};

const ChequeTable: React.FC<ChequeTableProps> = ({ cheques, updateChequeStatus, filterStatus, setFilterStatus, searchTerm, setSearchTerm, dateRange, setDateRange, onViewImage }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Cheque Records</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name/number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-gray-800"
                />
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-gray-800 appearance-none pr-8"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(ChequeStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <Icon name="chevron-down" className="h-4 w-4" />
                    </div>
                </div>
                <input
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-gray-800"
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary text-gray-800"
                    placeholder="End Date"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="py-3 px-4 font-semibold">Payer/Payee</th>
                            <th className="py-3 px-4 font-semibold text-right">Amount</th>
                            <th className="py-3 px-4 font-semibold">Date</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-center">Alert</th>
                            <th className="py-3 px-4 font-semibold text-center">Attachment</th>
                            <th className="py-3 px-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cheques.length > 0 ? (
                            cheques.map(cheque => <ChequeRow key={cheque.id} cheque={cheque} updateChequeStatus={updateChequeStatus} onViewImage={onViewImage} />)
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">
                                    No cheques found for the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChequeTable;