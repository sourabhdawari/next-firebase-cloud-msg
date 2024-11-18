import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// Initialize Firebase Admin (do this once in a separate file)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, newsItem } = req.body;

    // Construct the message
   const message:any = {
  notification: {
    title: newsItem.title,
    body: newsItem.description,
  },
  data: {
    newsId: newsItem.id.toString(),
    url: `/news/${newsItem.id}`,
    title: newsItem.title,
    description: newsItem.description,
    imageUrl: newsItem.imageUrl,
    category: newsItem.category,
    timestamp: new Date().toISOString(),
  },
  token,
  // Configure Android-specific options
  android: {
    notification: {
      icon: 'news_icon',
      color: '#2196F3',
      clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      priority: 'high', // Ensure it matches the allowed values
    },
  },
  // Configure Web-specific options
  webpush: {
    headers: {
      Urgency: 'high',
    },
    notification: {
      requireInteraction: true,
      actions: [
        { action: 'read', title: 'Read Now' },
        { action: 'save', title: 'Save for Later' },
      ],
    },
    fcmOptions: {
      link: `/news/${newsItem.id}`,
    },
  },
};

    // Send the message
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

    res.status(200).json({ success: true, messageId: response });
  } catch (error:any) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Example usage of the API:
/*
fetch('/api/send-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'user_fcm_token',
    newsItem: {
      id: '123',
      title: 'Breaking News!',
      description: 'Something important just happened...',
      imageUrl: 'https://example.com/news-image.jpg',
      category: 'World News',
    }
  })
});
*/