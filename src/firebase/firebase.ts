import { initializeApp } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { FirebaseConfig } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyD8T29St_SmtqB6WCWCoP8wJVwYjZLgvIQ",
  authDomain: "styava-demo.firebaseapp.com",
  projectId: "styava-demo",
  storageBucket: "styava-demo.firebasestorage.app",
  messagingSenderId: "386224950059",
  appId: "1:386224950059:web:adfdae0a9a58489580936e",
  measurementId: "G-WDC95VSV4Q"
};

export const app = initializeApp(firebaseConfig);
export const messaging: Messaging | null = typeof window !== 'undefined' ? getMessaging(app) : null;