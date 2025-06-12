import { StreakModalProvider } from './contexts/StreakModalContext';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StreakModalProvider>
      {/* ...các provider khác... */}
      {children}
    </StreakModalProvider>
  );
}
