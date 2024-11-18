import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../utils/firebase/firebase';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';
import { NotificationPayload } from '../types';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload: any) => {
        const { title, body } = payload.notification;
        new Notification(title, { body });
      });

      return () => unsubscribe();
    }
  }, []);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;

