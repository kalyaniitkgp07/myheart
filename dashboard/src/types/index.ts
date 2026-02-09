export interface HeartRateRecord {
    id: number;
    heart_rate: number;
    status: 'NORMAL' | 'HIGH';
    timestamp: string;
}

export interface Statistics {
    averageBpm: number;
    highAlerts: number;
    latestRecord: HeartRateRecord | undefined;
}
