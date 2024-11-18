importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD8T29St_SmtqB6WCWCoP8wJVwYjZLgvIQ",
  authDomain: "styava-demo.firebaseapp.com",
  projectId: "styava-demo",
  storageBucket: "styava-demo.firebasestorage.app",
  messagingSenderId: "386224950059",
  appId: "1:386224950059:web:adfdae0a9a58489580936e",
  measurementId: "G-WDC95VSV4Q"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// src/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);

export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'your-vapid-key'
      });
      
      // Send this token to your server to store it for the user
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
};

export const onMessageListener = () => {
  const messaging = getMessaging(app);
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
