import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const ClientContext = createContext(false);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ClientContext.Provider value={isClient}>
      {children}
    </ClientContext.Provider>
  );
};

export const useIsClient = () => useContext(ClientContext);
