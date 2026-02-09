import { useState, useEffect, useCallback } from 'react';
import type { HeartRateRecord, Statistics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const POLL_INTERVAL = 3000;

export function useHeartRate() {
    const [records, setRecords] = useState<HeartRateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/heart-rate`);
            if (!response.ok) throw new Error('Failed to fetch heart rate data');
            const data = await response.json();
            setRecords(data);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Connection lost. Retrying...');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
        const interval = setInterval(fetchRecords, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchRecords]);

    const stats: Statistics = {
        latestRecord: records[0],
        averageBpm: records.length > 0
            ? Math.round(records.reduce((acc, curr) => acc + curr.heart_rate, 0) / records.length)
            : 0,
        highAlerts: records.filter(r => r.status === 'HIGH').length,
    };

    return { records, stats, loading, error, refetch: fetchRecords };
}
