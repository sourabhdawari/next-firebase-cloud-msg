import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, Messaging, GetTokenOptions, MessagePayload, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyD8T29St_SmtqB6WCWCoP8wJVwYjZLgvIQ",
  authDomain: "styava-demo.firebaseapp.com",
  databaseURL: "https://styava-demo-default-rtdb.firebaseio.com",
  projectId: "styava-demo",
  storageBucket: "styava-demo.firebasestorage.app",
  messagingSenderId: "386224950059",
  appId: "1:386224950059:web:adfdae0a9a58489580936e",
  measurementId: "G-WDC95VSV4Q"
};

let messaging: Messaging | null = null;

const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

if (typeof window !== 'undefined') {
  const apps = getApps();
  const app = apps.length ? apps[0] : initializeApp(firebaseConfig);
  
  try {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
      messaging = getMessaging(app);
    }
  } catch (error) {
    console.error('Error initializing messaging:', error);
  }
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    const vapidKey = 'BC93oRe8BP1pjbrq7TjoUJ1-xWhFD-O5G3f1tTUF4N-hpYd6FbTidHVev48McjLdcCRj31MKrzQTYy7BKZTTF3k';
    const tokenOptions: GetTokenOptions = {
      vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
    };

    const token = await getToken(messaging, tokenOptions);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const onMessageListener = (): Promise<MessagePayload | null> => {
  return new Promise((resolve) => {
    if (!messaging) {
      resolve(null);
      return;
    }
    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};