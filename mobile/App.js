import "./global.css";
import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Heart, ShieldAlert, Activity } from 'lucide-react-native';

const API_URL = process.env.API_URL || 'http://ec2-18-116-97-70.us-east-2.compute.amazonaws.com:8000';

export default function App() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestHeartRate = async () => {
    try {
      const response = await fetch(`${API_URL}/heart-rate`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      if (data.length > 0) {
        setRecord(data[0]);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestHeartRate();
    const interval = setInterval(fetchLatestHeartRate, 5000);
    return () => clearInterval(interval);
  }, []);

  const isHigh = record?.status === 'HIGH';
  const bgColor = isHigh ? 'bg-primary' : 'bg-bg-dark';

  return (
    <SafeAreaView className={`flex-1 px-5 ${bgColor}`}>
      <StatusBar barStyle="light-content" />

      <View className="mt-10 items-center">
        <Text className="text-3xl font-extrabold text-white tracking-widest">HEARTSYNC MOBILE</Text>
        <Text className="text-sm text-white/60 mt-1 uppercase">Smartwatch Live Feed</Text>
      </View>

      <View className="flex-1 justify-center items-center">
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : error ? (
          <View className="items-center p-5">
            <ShieldAlert size={48} color="#ffffff" />
            <Text className="text-2xl font-bold text-white mt-4">{error}</Text>
            <Text className="text-sm text-white/60 mt-2 text-center">Check if API is running at {API_URL}</Text>
          </View>
        ) : record ? (
          <View className="items-center">
            <Heart
              size={120}
              color={isHigh ? "#ffffff" : "#00ff88"}
              fill={isHigh ? "#ffffff" : "#00ff88"}
              className="mb-5"
            />
            <Text className="text-[120px] font-black text-white leading-[120px]">{record.heart_rate}</Text>
            <Text className="text-2xl text-white/70 font-semibold mb-5">BPM</Text>

            <View className={`px-6 py-2 rounded-full border border-white/10 ${isHigh ? 'bg-white/20' : 'bg-success/10'}`}>
              <Text className={`font-extrabold text-lg uppercase ${isHigh ? 'text-white' : 'text-success'}`}>
                {record.status}
              </Text>
            </View>
          </View>
        ) : (
          <View className="items-center p-5">
            <Activity size={48} color="#ffffff" />
            <Text className="text-2xl font-bold text-white mt-4">Waiting for Data...</Text>
            <Text className="text-sm text-white/60 mt-2 text-center">Start the simulator to see readings</Text>
          </View>
        )}
      </View>

      <View className="mb-10 items-center">
        <Text className="text-white/50 text-[10px]">
          Last Update: {record ? new Date(record.timestamp).toLocaleTimeString() : '--:--'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
