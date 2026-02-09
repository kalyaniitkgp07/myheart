import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12">
            {children}
        </div>
    );
};
