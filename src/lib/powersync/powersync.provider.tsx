import { PowerSyncContext } from '@powersync/react-native';
import { PropsWithChildren, useMemo } from 'react';
import { system, SystemContext, useSystem } from '~/lib/powersync/system';

export const PowersyncProvider = ({ children }: PropsWithChildren) => {
  return (
    <SystemContext.Provider value={system}>
      <DBProvider>{children}</DBProvider>
    </SystemContext.Provider>
  );
};

const DBProvider = ({ children }: PropsWithChildren) => {
  const system = useSystem();
  const db = useMemo(() => {
    system.init();
    return system.powersync;
  }, [system]);
  return <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>;
};
