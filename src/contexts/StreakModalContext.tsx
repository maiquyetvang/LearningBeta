import React, { createContext, useContext, useState, useCallback } from 'react';
import StreakModal from '~/components/common/StreakModal';

const StreakModalContext = createContext<{
  showStreak: (streak: number) => void;
} | null>(null);

export const useStreakModal = () => useContext(StreakModalContext);

export function StreakModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [streak, setStreak] = useState(0);

  const showStreak = useCallback((s: number) => {
    setStreak(s);
    setVisible(true);
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <StreakModalContext.Provider value={{ showStreak }}>
      {children}
      <StreakModal visible={visible} streak={streak} onClose={handleClose} />
    </StreakModalContext.Provider>
  );
}
