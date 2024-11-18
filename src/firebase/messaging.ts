import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BC93oRe8BP1pjbrq7TjoUJ1-xWhFD-O5G3f1tTUF4N-hpYd6FbTidHVev48McjLdcCRj31MKrzQTYy7BKZTTF3k'
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};