import { useState, useEffect, useCallback } from 'react';
import { AttendanceData } from '@/types/attendance';

interface CachedData {
  data: AttendanceData | null;
  timestamp: number;
  isLoading: boolean;
  error: string | null;
}

const CACHE_KEY = 'ft_dashboard_attendance_cache';
const CACHE_DURATION = 10 * 60 * 1000;

export function useCachedData() {
  const [cachedData, setCachedData] = useState<CachedData>({
    data: null,
    timestamp: 0,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCachedData(parsed);
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  }, []);

  const saveToCache = useCallback((data: AttendanceData) => {
    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
      isLoading: false,
      error: null,
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setCachedData(cacheData);
    } catch (error) {
      console.error('Failed to save data to cache:', error);
    }
  }, []);

  const isCacheValid = useCallback(() => {
    if (!cachedData.data || !cachedData.timestamp) return false;
    return Date.now() - cachedData.timestamp < CACHE_DURATION;
  }, [cachedData.data, cachedData.timestamp]);

  const fetchFreshData = useCallback(async (sessionCookie: string): Promise<AttendanceData> => {
    setCachedData((prev: CachedData) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/attendance', {
        headers: {
          'Cookie': `session=${sessionCookie}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      saveToCache(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setCachedData((prev: CachedData) => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [saveToCache]);

  const refreshData = useCallback(async (sessionCookie: string) => {
    try {
      await fetchFreshData(sessionCookie);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [fetchFreshData]);

  const getData = useCallback(async (sessionCookie: string): Promise<AttendanceData> => {
    if (isCacheValid() && cachedData.data) {
      return cachedData.data;
    }

    return await fetchFreshData(sessionCookie);
  }, [isCacheValid, cachedData.data, fetchFreshData]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setCachedData({
        data: null,
        timestamp: 0,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, []);

  return {
    data: cachedData.data,
    isLoading: cachedData.isLoading,
    error: cachedData.error,
    isCacheValid: isCacheValid(),
    lastUpdated: cachedData.timestamp,
    getData,
    refreshData,
    clearCache,
  };
}
