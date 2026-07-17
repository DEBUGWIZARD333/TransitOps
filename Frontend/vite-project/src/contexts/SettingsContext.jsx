import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { fetchSettings } from '../services/settingsService';

const SettingsContext = createContext(null);

const currencySymbols = {
  NGN: '₦',
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettingsState] = useState({
    companyName: 'TransitOps',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    currency: 'NGN',
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      if (data) {
        setSettingsState(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const currencySymbol = useMemo(() => {
    const cur = settings?.currency || 'NGN';
    return currencySymbols[cur.toUpperCase()] || cur;
  }, [settings]);

  const formatMoney = (amount) => {
    const numeric = Number(amount || 0);
    return `${currencySymbol}${numeric.toLocaleString()}`;
  };

  const value = useMemo(() => ({
    settings,
    setSettings: setSettingsState,
    refreshSettings: loadSettings,
    currencySymbol,
    formatMoney,
    loading,
  }), [settings, currencySymbol, loading]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
