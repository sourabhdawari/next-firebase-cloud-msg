import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
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
      const { title, body } = req.body;
  
      if (!title || !body) {
        return res.status(400).json({
          error: 'Title and body are required',
        });
      }
  
      const db = getFirestore();
      const tokensSnapshot = await db.collection('fcmTokens').get();
      const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);
  
      if (tokens.length === 0) {
        return res.status(404).json({
          message: 'No registered devices found',
        });
      }
  
      // Send notification to all tokens in batches
      const responses = await Promise.all(
        tokens.map((token) =>
          admin.messaging().send({
            notification: {
              title,
              body,
            },
            token,
          })
        )
      );
  
      const failedTokens = responses
        .map((resp, idx) => (!resp ? tokens[idx] : null))
        .filter((token): token is string => token !== null);
  
      for (const token of failedTokens) {
        await db.collection('fcmTokens').doc(token).delete();
      }
  
      return res.status(200).json({
        success: true,
        sent: responses.length - failedTokens.length,
        failed: failedTokens.length,
        total: tokens.length,
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
      return res.status(500).json({ error: 'Failed to send notifications' });
    }
  }