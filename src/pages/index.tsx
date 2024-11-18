import type { NextPage } from 'next';
import NotificationRequestButton from '../components/NotificationRequestButton';
import { useState } from 'react';
import TestNotification from '../components/TestNotification';
import { getToken } from '@firebase/messaging';
import { messaging } from '../firebase/firebase';

const Home: NextPage = () => {
  const [fcmToken, setFcmToken] = useState<string>('');
  const [tokenStatus, setTokenStatus] = useState<string>('');

  const testNotification = async () => {
    try {
      // 1. Check if notifications are supported
      if (!('Notification' in window)) {
        setTokenStatus('❌ Notifications not supported');
        return;
      }

      // 2. Check/Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setTokenStatus('❌ Notification permission denied');
        return;
      }

      // 3. Get FCM token
      if (!messaging) {
        setTokenStatus('❌ Firebase messaging not initialized');
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (token) {
        setTokenStatus(`✅ FCM Token received: ${token.slice(0, 20)}...`);
        console.log('Full token for testing:', token);

        // 4. Create a test notification
        new Notification('Test Notification', {
          body: 'If you see this, basic notifications are working!',
          icon: '/icon.png' // Make sure you have an icon in public folder
        });
      } else {
        setTokenStatus('❌ Failed to get FCM token');
      }

    } catch (error) {
      console.error('Error:', error);
      setTokenStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  const handleTokenReceived = (token: string) => {
    setFcmToken(token);
  };

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Push Notification Test</h1>
    
    <button
      onClick={testNotification}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Test Notifications
    </button>

    {tokenStatus && (
      <div className="mt-4 p-4 border rounded">
        <p className="font-mono">{tokenStatus}</p>
      </div>
    )}

    <div className="mt-4">
      <h2 className="font-bold">Debug Checklist:</h2>
      <ul className="list-disc pl-5 mt-2">
        <li>Check console for any errors</li>
        <li>Verify firebase-messaging-sw.js is in public folder</li>
        <li>Confirm all environment variables are set</li>
        <li>Make sure you're using HTTPS (required for notifications)</li>
      </ul>
    </div>
  </div>
  );
};





export default Home
