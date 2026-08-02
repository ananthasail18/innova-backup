import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SessionContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('tasteai_user_id');
    if (storedUserId) {
      setUserIdState(storedUserId);
    }
    setIsLoaded(true);
  }, []);

  const setUserId = (id: string | null) => {
    if (id) {
      localStorage.setItem('tasteai_user_id', id);
    } else {
      localStorage.removeItem('tasteai_user_id');
    }
    setUserIdState(id);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ userId, setUserId }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
