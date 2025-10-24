import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useAuth } from '../contexts/AuthContext';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { ws } = useWebSocket();
  const { user } = useAuth();

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/notifications/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results || data);
        
        // Count unread notifications
        const unread = (data.results || data).filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/notifications/notifications/unread_count/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/notifications/notifications/${notificationId}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/notifications/notifications/mark_all_as_read/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (!ws) {
      console.log('❌ No WebSocket available in useNotifications');
      return;
    }

    console.log('✅ Setting up WebSocket message listener');

    const handleMessage = (event) => {
      console.log('📨 useNotifications received WebSocket message:', event.data);
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          const newNotification = data.notification;
          
          
          // Add new notification to the list
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast inside the app
          toast.info(`${newNotification.title}: ${newNotification.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Show browser notification if permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/logo192.png',
            });
          }
          
          console.log('✅ Notification processed successfully');
        } else if (data.type === 'connection_established') {
          console.log('✅ WebSocket connection confirmed');
        }
      } catch (error) {
        console.error('❌ Error handling WebSocket message:', error);
      }
    };

    ws.addEventListener('message', handleMessage);

    // cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket message listener');
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};

export default useNotifications;
