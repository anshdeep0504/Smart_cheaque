
import React from 'react';
import { Icon } from './Icon';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3">
                        <Icon name="logo" className="h-10 w-10 text-brand-primary" />
                        <h1 className="text-2xl font-bold text-gray-900">
                           B2B Cheque Manager
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
