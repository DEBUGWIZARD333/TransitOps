import { createContext, useContext, useMemo, useState } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const value = useMemo(() => ({
    isCollapsed,
    toggleSidebar: () => setIsCollapsed((prev) => !prev),
  }), [isCollapsed]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => useContext(SidebarContext);
