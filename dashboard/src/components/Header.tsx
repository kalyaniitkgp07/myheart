import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent font-['Outfit']">
                HeartSync Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Real-time Smartwatch Monitoring</p>
        </header>
    );
};
