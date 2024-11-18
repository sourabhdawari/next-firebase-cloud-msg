import { useEffect, useState } from 'react';
import { initializeNotifications, showTestNotification } from '../utils/finalnotificationUtils/notifications';

const Home = () => {
  const [tokenStatus, setTokenStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleInitialize = async () => {
      try {
        setTokenStatus('Initializing...');
        const token = await initializeNotifications(
          // Token callback
          (token) => {
            setTokenStatus(`✅ FCM Token received: ${token.slice(0, 20)}...`);
            console.log('Full token for testing:', token);
          },
          // Message callback
          (payload) => {
            console.log('Message received:', payload);
            // Handle foreground messages here
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setTokenStatus(`❌ Error: ${errorMessage}`);
      }
    };

    handleInitialize();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Push Notification Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={showTestNotification}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show Test Notification
        </button>

        {tokenStatus && (
          <div className="p-4 border rounded">
            <p className="font-mono">{tokenStatus}</p>
          </div>
        )}

        {error && (
          <div className="p-4 border border-red-500 rounded bg-red-50">
            <p className="text-red-600">{error}</p>
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
    </div>
  );
};

export default Home;