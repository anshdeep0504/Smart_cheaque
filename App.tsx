import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Cheque, ChequeStatus, FilterStatus } from './types';
import { sampleCheques } from './constants';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import ChequeTable from './components/ChequeTable';
import AddChequeModal from './components/AddChequeModal';
import AiAssistant from './components/AiAssistant';
import ImagePreviewModal from './components/ImagePreviewModal';

// Define the component outside of the App component to prevent re-creation on re-renders.
const AddChequeButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="fixed bottom-8 right-8 bg-brand-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 z-20 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
        Add New Cheque
    </button>
);


const App: React.FC = () => {
    const [cheques, setCheques] = useState<Cheque[]>(sampleCheques);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [alerts, setAlerts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

    const addAlert = useCallback((message: string, type: 'success' | 'error') => {
        const id = new Date().getTime().toString();
        setAlerts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 3000);
    }, []);

    const addCheque = useCallback((newCheque: Omit<Cheque, 'id'>) => {
        if (cheques.some(c => c.chequeNumber === newCheque.chequeNumber)) {
            addAlert(`Error: Cheque number ${newCheque.chequeNumber} already exists.`, 'error');
            return false;
        }
        const chequeWithId: Cheque = { ...newCheque, id: Date.now().toString() };
        setCheques(prevCheques => [chequeWithId, ...prevCheques]);
        addAlert('Cheque added successfully!', 'success');
        return true;
    }, [cheques, addAlert]);

    const updateChequeStatus = useCallback((id: string, status: ChequeStatus) => {
        setCheques(prevCheques =>
            prevCheques.map(cheque =>
                cheque.id === id ? { ...cheque, status } : cheque
            )
        );
        addAlert(`Cheque status updated to ${status}.`, 'success');
    }, [addAlert]);

    const filteredCheques = useMemo(() => {
        return cheques.filter(cheque => {
            const matchesStatus = filterStatus === 'all' || cheque.status === filterStatus;
            const matchesSearch =
                searchTerm.trim() === '' ||
                cheque.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cheque.chequeNumber.toLowerCase().includes(searchTerm.toLowerCase());
            
            const chequeDate = new Date(cheque.date);
            const startDate = dateRange.start ? new Date(dateRange.start) : null;
            const endDate = dateRange.end ? new Date(dateRange.end) : null;
            
            // Adjust dates to avoid timezone issues where date might be off by one
            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);

            const matchesDate = 
                (!startDate || chequeDate >= startDate) &&
                (!endDate || chequeDate <= endDate);

            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [cheques, filterStatus, searchTerm, dateRange]);

    useEffect(() => {
        // A simple check for post-dated cheques nearing due date
        const today = new Date();
        const upcomingCheques = cheques.filter(c => {
            if (c.status !== ChequeStatus.Pending) return false;
            const chequeDate = new Date(c.date);
            const diffTime = chequeDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 7;
        });

        if (upcomingCheques.length > 0) {
            console.log(`You have ${upcomingCheques.length} cheque(s) nearing their due date.`);
            // In a real app, you would show a more persistent notification
        }
    }, [cheques]);


    return (
        <div className="min-h-screen text-gray-800">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                {/* Alerts container */}
                <div className="fixed top-20 right-8 z-50 space-y-2">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`px-4 py-2 rounded-md shadow-lg text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {alert.message}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <DashboardStats cheques={cheques} />
                        <ChequeTable
                            cheques={filteredCheques}
                            updateChequeStatus={updateChequeStatus}
                            onViewImage={setViewingImage}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <AiAssistant cheques={cheques} />
                    </div>
                </div>
            </main>
            <AddChequeButton onClick={() => setIsModalOpen(true)} />
            <AddChequeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                addCheque={addCheque}
            />
            {viewingImage && (
                <ImagePreviewModal 
                    imageUrl={viewingImage} 
                    onClose={() => setViewingImage(null)} 
                />
            )}
        </div>
    );
};

export default App;