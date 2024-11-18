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

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
