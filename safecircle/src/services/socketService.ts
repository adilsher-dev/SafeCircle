import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ENV } from '@/config/env';
import { tokenStorage } from '@/utils/tokenStorage';

type Listener<T> = (payload: T) => void;

class SocketService {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private listeners = new Map<string, Set<Listener<unknown>>>();
  private connected = false;
  private connectPromise: Promise<void> | null = null;

  connect(): Promise<void> {
    if (this.connected) return Promise.resolve();
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = new Promise((resolve) => {
      const client = new Client({
        webSocketFactory: () => new SockJS(ENV.WS_BASE_URL) as unknown as WebSocket,
        connectHeaders: {
          Authorization: `Bearer ${tokenStorage.getAccessToken() ?? ''}`,
        },
        reconnectDelay: 4000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
          this.connected = true;
          // Re-subscribe any topics registered before/after disconnects
          this.listeners.forEach((_set, destination) => {
            this.ensureSubscribed(destination);
          });
          resolve();
        },
        onDisconnect: () => {
          this.connected = false;
        },
        onWebSocketClose: () => {
          this.connected = false;
        },
        onStompError: () => {
          this.connected = false;
        },
      });

      client.activate();
      this.client = client;
    });

    return this.connectPromise;
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.listeners.clear();
    this.client?.deactivate();
    this.client = null;
    this.connected = false;
    this.connectPromise = null;
  }

  private ensureSubscribed(destination: string) {
    if (!this.client || !this.connected) return;
    if (this.subscriptions.has(destination)) return;

    const sub = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body);
        this.listeners.get(destination)?.forEach((cb) => cb(payload));
      } catch {
        // ignore malformed payloads
      }
    });
    this.subscriptions.set(destination, sub);
  }

  subscribe<T>(destination: string, listener: Listener<T>): () => void {
    if (!this.listeners.has(destination)) {
      this.listeners.set(destination, new Set());
    }
    this.listeners.get(destination)!.add(listener as Listener<unknown>);

    this.connect().then(() => this.ensureSubscribed(destination));

    return () => {
      this.listeners.get(destination)?.delete(listener as Listener<unknown>);
      if (this.listeners.get(destination)?.size === 0) {
        this.subscriptions.get(destination)?.unsubscribe();
        this.subscriptions.delete(destination);
        this.listeners.delete(destination);
      }
    };
  }

  publish(destination: string, body: unknown) {
    if (!this.client || !this.connected) return;
    this.client.publish({ destination, body: JSON.stringify(body) });
  }

  isConnected() {
    return this.connected;
  }
}

export const socketService = new SocketService();

// Topic helpers matching backend WebSocketServiceImpl / WebSocketController exactly:
//  - /topic/location/{journeyId}     (LiveLocationMessage)
//  - /topic/alert/{journeyId}        (AlertMessage) -- keyed by journeyId, not userId
//  - /topic/notification/{userId}    (NotificationMessage)
//  - /topic/journey/{journeyId}      (JourneyStatusMessage)
export const wsTopics = {
  liveLocation: (journeyId: number) => `/topic/location/${journeyId}`,
  alert: (journeyId: number) => `/topic/alert/${journeyId}`,
  notification: (userId: number) => `/topic/notification/${userId}`,
  journeyStatus: (journeyId: number) => `/topic/journey/${journeyId}`,
};

export const wsDestinations = {
  sendLocation: '/app/location',
};
