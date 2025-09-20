import React, { useState, FormEvent, useEffect, ChangeEvent, useCallback } from 'react';
import { Cheque, ChequeStatus } from '../types';
import { extractChequeDetailsFromImage } from '../services/geminiService';
import { Icon } from './Icon';

interface AddChequeModalProps {
    isOpen: boolean;
    onClose: () => void;
    addCheque: (newCheque: Omit<Cheque, 'id'>) => boolean;
}

const AddChequeModal: React.FC<AddChequeModalProps> = ({ isOpen, onClose, addCheque }) => {
    const [name, setName] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formVisible, setFormVisible] = useState(false);


    const resetForm = useCallback(() => {
        setName('');
        setChequeNumber('');
        setAmount('');
        setDate('');
        setImage(null);
        setError('');
        setIsProcessing(false);
        setFormVisible(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setError('');
            setIsProcessing(true);
            setFormVisible(false);

            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUrl = reader.result as string;
                setImage(dataUrl);
                
                try {
                    const [mimeType, base64Data] = dataUrl.split(';base64,');
                    if (!mimeType || !base64Data) {
                        throw new Error("Invalid image format.");
                    }
                    const extractedData = await extractChequeDetailsFromImage({
                        inlineData: { mimeType: mimeType.replace('data:', ''), data: base64Data }
                    });
                    
                    setName(extractedData.name);
                    setChequeNumber(extractedData.chequeNumber);
                    setAmount(String(extractedData.amount));
                    setDate(extractedData.date);
                    setFormVisible(true);

                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred during image processing.');
                    // Allow manual entry on error
                    setFormVisible(true); 
                } finally {
                    setIsProcessing(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !chequeNumber || !amount || !date) {
            setError('All fields are mandatory.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        const success = addCheque({
            name,
            chequeNumber,
            amount: parseFloat(amount),
            date,
            status: ChequeStatus.Pending,
            image: image || undefined,
        });

        if (success) {
            onClose();
        } else {
             setError('This cheque number already exists.');
        }
    };
    
    const showManualForm = () => {
        setFormVisible(true);
        setImage(null); // Clear image if switching to manual
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
                 <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add New Cheque</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}

                    {!formVisible && !isProcessing && (
                         <div className="text-center py-8">
                             <Icon name="scan" className="mx-auto h-16 w-16 text-gray-400" />
                             <label htmlFor="image-upload" className="mt-4 cursor-pointer inline-block bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">
                                 Upload Cheque Image
                             </label>
                             <input type="file" id="image-upload" onChange={handleImageChange} accept="image/*" className="hidden"/>
                             <p className="mt-4 text-sm text-gray-500">or</p>
                             <button type="button" onClick={showManualForm} className="mt-2 text-brand-primary hover:underline font-semibold">
                                 Enter Details Manually
                             </button>
                         </div>
                    )}

                    {isProcessing && (
                        <div className="flex flex-col items-center justify-center p-8 space-y-4">
                            <Icon name="loading" className="h-12 w-12 animate-spin text-brand-primary" />
                            <p className="text-gray-600 font-semibold">Analyzing Cheque...</p>
                            {image && <img src={image} alt="Cheque preview" className="rounded-md border max-h-40 w-auto mt-4 opacity-50" />}
                        </div>
                    )}
                    
                    {(formVisible || image) && !isProcessing && (
                    <>
                        {image && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                                <img src={image} alt="Cheque preview" className="rounded-md border max-h-40 w-auto" />
                            </div>
                        )}
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">Please review the extracted details and correct them if necessary.</p>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Payer/Payee Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                        </div>
                        <div>
                            <label htmlFor="chequeNumber" className="block text-sm font-medium text-gray-700">Cheque Number</label>
                            <input type="text" id="chequeNumber" value={chequeNumber} onChange={e => setChequeNumber(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (INR)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required min="0.01" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Cheque Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                        </div>
                        <div className="pt-4 flex justify-end space-x-3 border-t mt-6">
                            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
                                Cancel
                            </button>
                            <button type="submit" className="bg-brand-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                                Add Cheque
                            </button>
                        </div>
                    </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddChequeModal;