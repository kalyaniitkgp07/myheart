import { useState, useEffect } from 'react';
import { Heart, Activity, Clock, ShieldAlert } from 'lucide-react';

interface HeartRateRecord {
  id: number;
  heart_rate: number;
  status: string;
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [records, setRecords] = useState<HeartRateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/heart-rate`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setRecords(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Connection lost. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 3000);
    return () => clearInterval(interval);
  }, []);

  const latestRecord = records[0];
  const averageBpm = records.length > 0
    ? Math.round(records.reduce((acc, curr) => acc + curr.heart_rate, 0) / records.length)
    : 0;
  const highAlerts = records.filter(r => r.status === 'HIGH').length;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent font-['Outfit']">
          HeartSync Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Real-time Smartwatch Monitoring</p>
      </header>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-[1.5rem] p-6 transition-all hover:-translate-y-1">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Latest Reading</div>
            <div className={`text-4xl font-bold font-['Outfit'] flex items-center gap-3 ${latestRecord?.status === 'HIGH' ? 'text-primary' : 'text-success'}`}>
              {latestRecord ? (
                <>
                  {latestRecord.heart_rate}
                  <span className="text-base text-gray-500 font-normal mt-2">BPM</span>
                  <Heart className="pulse" size={28} fill={latestRecord?.status === 'HIGH' ? 'var(--primary)' : 'var(--success)'} />
                </>
              ) : '--'}
            </div>
          </div>

          <div className="glass rounded-[1.5rem] p-6 transition-all hover:-translate-y-1">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Average (Last 20)</div>
            <div className="text-4xl font-bold font-['Outfit'] text-white flex items-center gap-3">
              {averageBpm} <span className="text-base text-gray-500 font-normal mt-2">BPM</span>
              <Activity className="text-indigo-400" size={28} />
            </div>
          </div>

          <div className="glass rounded-[1.5rem] p-6 transition-all hover:-translate-y-1">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">High Alerts</div>
            <div className={`text-4xl font-bold font-['Outfit'] flex items-center gap-3 ${highAlerts > 0 ? 'text-primary' : 'text-gray-500'}`}>
              {highAlerts}
              <ShieldAlert size={28} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-primary p-4 rounded-2xl text-center border border-red-500/20">
            {error}
          </div>
        )}

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
                <tr key={record.id} className={`border-b border-white/5 transition-colors ${record.status === 'HIGH' ? 'bg-primary/10 text-red-200' : 'hover:bg-white/[0.02]'}`}>
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
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.status === 'HIGH'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-success/10 text-success border border-success/30'
                      }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-500 text-xs">
                    #{record.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
