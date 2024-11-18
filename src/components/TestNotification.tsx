import { FC, useState } from 'react';

interface TestNotificationProps {
  token: string;
}

const TestNotification: FC<TestNotificationProps> = ({ token }) => {
  const [status, setStatus] = useState<string>('');

  const sendTestNotification = async () => {
    try {
      setStatus('Sending...');
      const response = await fetch('/api/send-test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      if (data.success) {
        setStatus('Notification sent successfully!');
      } else {
        setStatus('Failed to send notification: ' + data.error);
      }
    } catch (error) {
      setStatus('Error sending notification');
      console.error('Error:', error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={sendTestNotification}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Send Test Notification
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default TestNotification;