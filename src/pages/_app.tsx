import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../utils/firebase/firebase';
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Request permission and get FCM token
    requestNotificationPermission();

    // Handle foreground messages
    onMessageListener()
      .then((payload:any) => {
        console.log('Received foreground message:', payload);
        // You can show a custom notification UI here
      })
      .catch((err:any) => console.log('Failed to receive message:', err));
  }, []);
  return <Component {...pageProps} />;
}
