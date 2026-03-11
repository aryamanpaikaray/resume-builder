import { useState, useEffect, useCallback } from "react";
import { checkAccess } from "../utils/api";

export function useAccessTimer() {
  const [accessAllowed, setAccessAllowed] = useState(null); // null = loading
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(async () => {
    try {
      const { data } = await checkAccess();
      setAccessAllowed(data.allowed);
      setRemainingSeconds(data.remainingSeconds || 0);
    } catch (err) {
      setAccessAllowed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  // Count down locally
  useEffect(() => {
    if (!accessAllowed || remainingSeconds === 0) return; // ← guard both conditions
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setAccessAllowed(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [accessAllowed, remainingSeconds === 0]); // ← track when seconds transitions from 0

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return {
    accessAllowed,
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
    loading,
  };
}
