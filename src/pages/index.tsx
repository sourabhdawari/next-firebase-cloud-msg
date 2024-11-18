import type { NextPage } from 'next';
import NotificationRequestButton from '../components/NotificationRequestButton';
import { useState } from 'react';
import TestNotification from '../components/TestNotification';

const Home: NextPage = () => {
  const [fcmToken, setFcmToken] = useState<string>('');

  const handleTokenReceived = (token: string) => {
    setFcmToken(token);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Push Notifications Demo</h1>
      <NotificationRequestButton 
        userId="user123" 
        onTokenReceived={handleTokenReceived}
      />
      {fcmToken && <TestNotification token={fcmToken} />}
    </div>
  );
};





export default Home
