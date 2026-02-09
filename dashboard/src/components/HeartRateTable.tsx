import { Clock } from 'lucide-react';
import type { HeartRateRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface HeartRateTableProps {
    records: HeartRateRecord[];
    loading: boolean;
}

export const HeartRateTable: React.FC<HeartRateTableProps> = ({ records, loading }) => {
    return (
        <div className="glass rounded-[1.5rem] overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="px-6 py-5 text-gray-400 font-semibold text-xs uppercase tracking-widest">Time</th>
                        <th className="px-6 py-5 text-gray-400 font-semibold text-xs uppercase tracking-widest">Heart Rate</th>
                        <th className="px-6 py-5 text-gray-400 font-semibold text-xs uppercase tracking-widest">Status</th>
                        <th className="px-6 py-5 text-gray-400 font-semibold text-xs uppercase tracking-widest">Record ID</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 && !loading && (
                        <tr>
                            <td colSpan={4} className="text-center py-12 text-gray-500">
                                No data received yet. Waiting for simulator...
                            </td>
                        </tr>
                    )}
                    {records.map((record) => (
                        <tr
                            key={record.id}
                            className={`border-b border-white/5 transition-colors ${record.status === 'HIGH' ? 'bg-primary/10 text-red-200' : 'hover:bg-white/[0.02]'
                                }`}
                        >
                            <td className={`px-6 py-5 ${record.status === 'HIGH' ? 'border-l-4 border-primary' : ''}`}>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-500" />
                                    {new Date(record.timestamp).toLocaleTimeString()}
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="font-bold text-lg font-['Outfit']">{record.heart_rate}</span>
                                <span className="text-xs text-gray-500 ml-1">BPM</span>
                            </td>
                            <td className="px-6 py-5">
                                <StatusBadge status={record.status} />
                            </td>
                            <td className="px-6 py-5 text-gray-500 text-xs">
                                #{record.id}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
