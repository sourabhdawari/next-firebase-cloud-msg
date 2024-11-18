import { db } from '../firebase/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';

interface TokenData {
  token: string;
  createdAt: Date;
  lastActive: Date;
  platform: string;
}

export const saveToken = async (token: string): Promise<void> => {
  try {
    const tokenRef = doc(db, 'fcmTokens', token);
    const tokenData: TokenData = {
      token,
      createdAt: new Date(),
      lastActive: new Date(),
      platform: navigator.userAgent
    };
    
    await setDoc(tokenRef, tokenData);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

export const removeToken = async (token: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'fcmTokens', token));
  } catch (error) {
    console.error('Error removing token:', error);
  }
};