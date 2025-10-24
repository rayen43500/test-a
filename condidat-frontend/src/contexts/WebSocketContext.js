import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from './AuthContext';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const ws = useRef(null);
  const [socket, setSocket] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 seconds

  const connect = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log('❌ No token available for WebSocket connection');
      return;
    }

    // Close existing connection if any
    if (ws.current) {
      ws.current.close();
    }

    // Create new WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/notifications/?token=${token}`;
    
    console.log('🔌 Attempting WebSocket connection to:', wsUrl);
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket Connected successfully!');
      reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      // expose live socket to consumers only when open
      setSocket(ws.current);
    };

    ws.current.onclose = (e) => {
      console.log('❌ WebSocket Disconnected:', e.code, e.reason);
      // clear exposed socket so consumers know it's gone
      setSocket(null);
      
      // Attempt to reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const timeout = reconnectInterval * Math.pow(2, reconnectAttempts.current);
        console.log(`🔄 Attempting to reconnect in ${timeout/1000} seconds... (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
        
        setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, timeout);
      } else {
        console.log('❌ Max reconnection attempts reached');
      }
    };

    ws.current.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
    };

    ws.current.onmessage = (event) => {
      console.log('📨 WebSocket message received:', event.data);
    };
  }, []);

  // Setup connection on mount and whenever user changes
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken && user) {
      console.log('🔑 Token and user available, connecting WebSocket...');
      connect();
    } else {
      console.log('⏳ Waiting for token and user...', { hasToken: !!storedToken, hasUser: !!user });
    }

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect, user]);

  // Function to send messages through the WebSocket
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    }
    console.warn('WebSocket is not connected');
    return false;
  }, []);

  // Function to mark a notification as read
  const markAsRead = useCallback(async (notificationId) => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/notifications/${notificationId}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, []);

  const value = {
    ws: socket,
    sendMessage,
    markAsRead,
    isConnected: socket?.readyState === WebSocket.OPEN,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
