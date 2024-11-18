import type { NextPage } from 'next';
import NotificationRequestButton from '../components/NotificationRequestButton';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Push Notifications Demo</h1>
      <NotificationRequestButton userId="user123" />
    </div>
  );
};




export default Home
