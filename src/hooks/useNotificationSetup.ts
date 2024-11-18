import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '../utils/firebase/firebase';
import { db } from '../firebase/firebase';
import { ref, update } from 'firebase/database';

interface NotificationSetupState {
  permission: NotificationPermission;
  token: string | null;
  error: Error | null;
  loading: boolean;
}

export const useNotificationSetup = () => {
  const [state, setState] = useState<NotificationSetupState>({
    permission: 'default',
    token: null,
    error: null,
    loading: true
  });

  const setupNotifications = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Check if notifications are supported
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      // Get current permission status
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Get FCM token
        const token = await requestNotificationPermission();
        
        if (token) {
          // Save token to your backend
          await fetch('/api/notifications/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
         
        }
      } else {
        setState({
          permission,
          token: null,
          error: null,
          loading: false
        });
      }
    } catch (error:any) {
      setState({
        permission: 'default',
        token: null,
        error,
        loading: false
      });
    }
  };

  // Auto-setup on component mount
  useEffect(() => {
    setupNotifications();
  }, []);

  return {
    ...state,
    requestPermission: setupNotifications
  };
};