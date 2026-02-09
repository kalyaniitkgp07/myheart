import React from 'react';
import type { HeartRateRecord } from '../types';

interface StatusBadgeProps {
    status: HeartRateRecord['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const isHigh = status === 'HIGH';

    return (
        <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isHigh
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-success/10 text-success border border-success/30'
                }`}
        >
            {status}
        </span>
    );
};
