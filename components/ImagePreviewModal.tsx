import React from 'react';

interface ImagePreviewModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image Preview"
        >
            <div 
                className="relative bg-white p-4 rounded-lg shadow-xl max-w-4xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 bg-gray-600 rounded-full p-1 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close image preview"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img 
                    src={imageUrl} 
                    alt="Cheque attachment" 
                    className="max-w-full max-h-[85vh] object-contain" 
                />
            </div>
        </div>
    );
};

export default ImagePreviewModal;
