import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "soc_analysis_history";
const MAX_ENTRIES = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupted or non-JSON data in storage — reset instead of crashing the app
    return [];
  }
}

function saveHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    // Most likely QuotaExceededError (storage full)
    return false;
  }
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState(() => loadHistory());
  const [storageWarning, setStorageWarning] = useState(null);

  // Keep in sync if history is changed from another tab
  useEffect(() => {
    function handleStorageEvent(e) {
      if (e.key === STORAGE_KEY) {
        setHistory(loadHistory());
      }
    }
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  const addEntry = useCallback((filename, result) => {
    const entry = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      filename,
      timestamp: new Date().toISOString(),
      severity: result.severity,
      total_logs: result.total_logs,
      failed_login: result.failed_login,
      unique_ip: result.unique_ip,
      alert_count: result.alerts ? result.alerts.length : 0,
      result,
    };

    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      const ok = saveHistory(next);
      setStorageWarning(
        ok ? null : "Storage is full — oldest entries may not be saved.",
      );
      return next;
    });

    return entry;
  }, []);

  const deleteEntry = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const exportHistory = useCallback(() => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `soc-analysis-history-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [history]);

  return {
    history,
    addEntry,
    deleteEntry,
    clearHistory,
    exportHistory,
    storageWarning,
  };
}
