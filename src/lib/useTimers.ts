"use client";

import { useRef, useEffect, useCallback } from "react";

export function useTimers() {
  const timeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const intervals = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  const addTimeout = useCallback((fn: () => void, ms: number): ReturnType<typeof setTimeout> => {
    const id = setTimeout(() => {
      timeouts.current.delete(id);
      fn();
    }, ms);
    timeouts.current.add(id);
    return id;
  }, []);

  const addInterval = useCallback((fn: () => void, ms: number): ReturnType<typeof setInterval> => {
    const id = setInterval(fn, ms);
    intervals.current.add(id);
    return id;
  }, []);

  const clearTimer = useCallback((id: ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>) => {
    clearTimeout(id as ReturnType<typeof setTimeout>);
    clearInterval(id as ReturnType<typeof setInterval>);
    timeouts.current.delete(id as ReturnType<typeof setTimeout>);
    intervals.current.delete(id as ReturnType<typeof setInterval>);
  }, []);

  const clearAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timeouts.current.clear();
    intervals.current.clear();
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  return { addTimeout, addInterval, clearTimer, clearAll };
}
