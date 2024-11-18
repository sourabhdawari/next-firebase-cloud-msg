import { FC, useState } from 'react';
import { requestNotificationPermission } from '../firebase/messaging';
import { saveUserToken } from '../utils/notifications';

interface NotificationRequestButtonProps {
  userId: string;
  className?: string;
}

const NotificationRequestButton: FC<NotificationRequestButtonProps> = ({ 
  userId, 
  className = ''
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (): Promise<void> => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        const result = await saveUserToken(userId, token);
        if (result.success) {
          setIsSubscribed(true);
          setError(null);
        } else {
          setError(result.error || 'Failed to enable notifications');
        }
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      setError('Failed to subscribe to notifications');
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        className={`px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 ${className}`}
        disabled={isSubscribed}
      >
        {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default NotificationRequestButton;