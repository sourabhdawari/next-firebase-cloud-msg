import { getToken, onMessage } from 'firebase/messaging';
import { db, messaging } from '../../firebase/firebase';
import { ref, set } from 'firebase/database';

export const initializeNotifications = async (
  onTokenCallback?: (token: string) => void,
  onMessageCallback?: (payload: any) => void
) => {
  try {
    // 1. Check if notifications are supported
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    // 2. Check/Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // 3. Get FCM token
    if (!messaging) {
      throw new Error('Firebase messaging not initialized');
    }

    const token = await getToken(messaging, {
      vapidKey: 'BC93oRe8BP1pjbrq7TjoUJ1-xWhFD-O5G3f1tTUF4N-hpYd6FbTidHVev48McjLdcCRj31MKrzQTYy7BKZTTF3k'
    });

    if (!token) {
      throw new Error('Failed to get FCM token');
    }

    // Save token to localStorage and database
    localStorage.setItem('fcmToken', token);
    const tokensRef = ref(db, 'fcmTokens/' + token);
    await set(tokensRef, {
      timestamp: Date.now(),
      active: true
    });

    // Call token callback if provided
    if (onTokenCallback) {
      onTokenCallback(token);
    }

    // Set up foreground message handler
    if (onMessageCallback) {
      onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        onMessageCallback(payload);
      });
    }

    return token;

  } catch (error) {
    console.error('Notification initialization error:', error);
    throw error;
  }
};

export const showTestNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Test Notification', {
      body: 'If you see this, basic notifications are working!',
      icon: '/icon.png'
    });
  }
};