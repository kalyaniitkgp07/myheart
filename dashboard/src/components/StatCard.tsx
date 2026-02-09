import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    iconColor?: string;
    trendColor?: string;
    highlight?: boolean;
    pulse?: boolean;
    iconFill?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    unit,
    icon: Icon,
    iconColor = 'text-gray-400',
    trendColor = 'text-white',
    pulse = false,
    iconFill
}) => {
    return (
        <div className="glass rounded-[1.5rem] p-6 transition-all hover:-translate-y-1">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                {title}
            </div>
            <div className={`text-4xl font-bold font-['Outfit'] flex items-center gap-3 ${trendColor}`}>
                {value}
                {unit && <span className="text-base text-gray-500 font-normal mt-2">{unit}</span>}
                <Icon
                    className={pulse ? 'pulse' : iconColor}
                    size={28}
                    fill={iconFill}
                />
            </div>
        </div>
    );
};
