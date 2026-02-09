import { Heart, Activity, ShieldAlert } from 'lucide-react';
import { useHeartRate } from './hooks/useHeartRate';
import { Layout, Header, StatCard, HeartRateTable } from './components';

function App() {
  const { records, stats, loading, error } = useHeartRate();
  const { latestRecord, averageBpm, highAlerts } = stats;

  return (
    <Layout>
      <Header />

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Latest Reading"
            value={latestRecord?.heart_rate ?? '--'}
            unit="BPM"
            icon={Heart}
            pulse={latestRecord?.status === 'HIGH'}
            trendColor={latestRecord?.status === 'HIGH' ? 'text-primary' : 'text-success'}
            iconFill={latestRecord?.status === 'HIGH' ? 'var(--color-primary)' : 'var(--color-success)'}
          />

          <StatCard
            title="Average (Last 20)"
            value={averageBpm}
            unit="BPM"
            icon={Activity}
            iconColor="text-indigo-400"
          />

          <StatCard
            title="High Alerts"
            value={highAlerts}
            icon={ShieldAlert}
            trendColor={highAlerts > 0 ? 'text-primary' : 'text-gray-500'}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 text-primary p-4 rounded-2xl text-center border border-red-500/20">
            {error}
          </div>
        )}

        <HeartRateTable
          records={records}
          loading={loading}
        />
      </div>
    </Layout>
  );
}

export default App;
