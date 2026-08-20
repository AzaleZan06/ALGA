import { PresentationState } from '../types';

const CHANNEL_NAME = 'bible_presentation_channel';
const STORAGE_KEY = 'bible_presentation_state';
const SCREEN_STATUS_KEY = 'alga_presentation_screen_active';

let channel: BroadcastChannel | null = null;
let socket: WebSocket | null = null;
let reconnectTimer: any = null;
let statusSubscribers: Set<(status: 'connected' | 'connecting' | 'disconnected') => void> = new Set();
let messageSubscribers: Set<(state: PresentationState) => void> = new Set();
let screenStatusSubscribers: Set<(status: 'opened' | 'closed') => void> = new Set();
let currentStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported or blocked:', e);
}

function updateStatus(newStatus: 'connected' | 'connecting' | 'disconnected') {
  currentStatus = newStatus;
  statusSubscribers.forEach((cb) => {
    try {
      cb(newStatus);
    } catch (e) {
      console.error('Error in status subscriber:', e);
    }
  });
}

function notifySubscribers(state: PresentationState) {
  messageSubscribers.forEach((cb) => {
    try {
      cb(state);
    } catch (e) {
      console.error('Error notifying presentation state subscriber:', e);
    }
  });
}

function notifyScreenStatusSubscribers(status: 'opened' | 'closed') {
  screenStatusSubscribers.forEach((cb) => {
    try {
      cb(status);
    } catch (e) {
      console.error('Error notifying screen status subscriber:', e);
    }
  });
}

// Initialize resilient WebSocket connection
export function initPresentationWebSocket() {
  if (typeof window === 'undefined') return;

  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  updateStatus('connecting');

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/presentation`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      updateStatus('connected');
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      // Request latest state if server has it
      try {
        socket?.send(JSON.stringify({ type: 'GET_STATE' }));
      } catch (e) {
        // ignore
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ((data.type === 'STATE_UPDATE' || data.type === 'STATE_INIT') && data.payload) {
          const incomingState = data.payload as PresentationState;
          
          // Save to local storage for local persistence
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(incomingState));
          } catch (e) {
            // ignore
          }

          notifySubscribers(incomingState);
        } else if (data.type === 'SCREEN_STATUS' && (data.status === 'opened' || data.status === 'closed')) {
          try {
            localStorage.setItem(SCREEN_STATUS_KEY, data.status);
          } catch (e) {
            // ignore
          }
          notifyScreenStatusSubscribers(data.status);
        }
      } catch (e) {
        console.warn('Failed to parse WebSocket message:', e);
      }
    };

    socket.onclose = () => {
      updateStatus('disconnected');
      socket = null;
      // Schedule automatic reconnection
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          initPresentationWebSocket();
        }, 1500);
      }
    };

    socket.onerror = () => {
      updateStatus('disconnected');
    };
  } catch (err) {
    console.warn('Failed to establish WebSocket connection:', err);
    updateStatus('disconnected');
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        initPresentationWebSocket();
      }, 2000);
    }
  }
}

// Broadcast presentation state to all connected slides, windows, and tabs
export const broadcastPresentationState = (state: PresentationState) => {
  const updated = { ...state, isAutoPlaying: false, updatedAt: Date.now() };

  // 1. Send via WebSocket to server and all external devices/tabs
  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({ type: 'STATE_UPDATE', payload: updated }));
    } catch (e) {
      console.warn('WebSocket send failed:', e);
    }
  } else {
    // If socket is disconnected, try reconnecting
    initPresentationWebSocket();
  }

  // 2. BroadcastChannel for instant same-browser inter-tab sync
  if (channel) {
    try {
      channel.postMessage({ type: 'STATE_UPDATE', payload: updated });
    } catch (e) {
      console.warn('BroadcastChannel postMessage failed:', e);
    }
  }

  // 3. Update localStorage fallback
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('localStorage update failed:', e);
  }

  // 4. Notify local in-memory subscribers
  notifySubscribers(updated);
};

// Broadcast when the external slideshow screen is opened or closed
export const broadcastScreenStatus = (status: 'opened' | 'closed') => {
  // 1. WebSocket
  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({ type: 'SCREEN_STATUS', status }));
    } catch (e) {
      console.warn('WebSocket send screen status failed:', e);
    }
  }

  // 2. BroadcastChannel
  if (channel) {
    try {
      channel.postMessage({ type: 'SCREEN_STATUS', status });
    } catch (e) {
      console.warn('BroadcastChannel send screen status failed:', e);
    }
  }

  // 3. LocalStorage
  try {
    localStorage.setItem(SCREEN_STATUS_KEY, status);
  } catch (e) {
    // ignore
  }

  // 4. In-memory
  notifyScreenStatusSubscribers(status);
};

export const getStoredPresentationState = (): PresentationState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return null;
};

export const subscribeToPresentationState = (
  callback: (state: PresentationState) => void,
  options: { emitInitial?: boolean } = {}
) => {
  // Ensure WebSocket is active
  initPresentationWebSocket();

  messageSubscribers.add(callback);

  // BroadcastChannel listener
  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data) {
      if (event.data.type === 'STATE_UPDATE' && event.data.payload) {
        callback(event.data.payload as PresentationState);
      } else if (typeof event.data === 'object' && 'currentIndex' in event.data) {
        callback(event.data as PresentationState);
      }
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcastMessage);
  }

  // Storage listener for cross-window fallback
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        callback(parsed);
      } catch (e) {
        // ignore
      }
    }
  };

  window.addEventListener('storage', handleStorage);

  // Load initial stored state only if requested (e.g. for secondary window)
  if (options.emitInitial) {
    const initial = getStoredPresentationState();
    if (initial) {
      callback(initial);
    }
  }

  return () => {
    messageSubscribers.delete(callback);
    if (channel) {
      channel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
};

export const subscribeToScreenStatus = (callback: (status: 'opened' | 'closed') => void) => {
  initPresentationWebSocket();
  screenStatusSubscribers.add(callback);

  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'SCREEN_STATUS' && (event.data.status === 'opened' || event.data.status === 'closed')) {
      callback(event.data.status);
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcastMessage);
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SCREEN_STATUS_KEY && (event.newValue === 'opened' || event.newValue === 'closed')) {
      callback(event.newValue);
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    screenStatusSubscribers.delete(callback);
    if (channel) {
      channel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
};

export const subscribeToWsStatus = (callback: (status: 'connected' | 'connecting' | 'disconnected') => void) => {
  initPresentationWebSocket();
  statusSubscribers.add(callback);
  callback(currentStatus);

  return () => {
    statusSubscribers.delete(callback);
  };
};
