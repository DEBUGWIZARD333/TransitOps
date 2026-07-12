import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const value = useMemo(() => ({
    notifications,
    addNotification: (item) => setNotifications((prev) => [item, ...prev]),
  }), [notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => useContext(NotificationContext);
