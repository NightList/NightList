import { getVersion, subscribe } from '@nightlist/mock';
import { useSyncExternalStore } from 'react';

export function useDemo(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}
