import { useEffect, useState } from 'react';
import { socketService } from '@/services/socketService';

/** Polls socket connection state so UI can show live/offline indicator. */
export function useSocketStatus() {
  const [connected, setConnected] = useState(socketService.isConnected());

  useEffect(() => {
    const interval = setInterval(() => {
      setConnected(socketService.isConnected());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return connected;
}
