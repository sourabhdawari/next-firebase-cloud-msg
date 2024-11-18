import { FC, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';
import { saveToken } from '../services/tokenService';

interface NotificationRequestButtonProps {
  onSuccess?: () => void;
}

const NotificationRequestButton: FC<NotificationRequestButtonProps> = ({ 
  onSuccess 
}) => {
  const [status, setStatus] = useState<string>('');

  const requestPermission = async () => {
    try {
      setStatus('Requesting permission...');
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('Notification permission denied');
        return;
      }

      if (!messaging) {
        setStatus('Firebase messaging not initialized');
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (token) {
        await saveToken(token);
        setStatus('Notifications enabled successfully!');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to enable notifications');
    }
  };

  return (
    <div>
      <button
        onClick={requestPermission}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enable Notifications
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default NotificationRequestButton;