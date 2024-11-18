export interface NotificationPayload {
    notification: {
      title: string;
      body: string;
    };
    data?: {
      [key: string]: string;
    };
  }
  
  export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }
  
  export interface TokenSaveResponse {
    success: boolean;
    error?: string;
  }