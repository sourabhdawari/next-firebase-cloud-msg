import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { db } from '../../firebase/firebase';
import { get, getDatabase, ref, remove } from 'firebase/database';
import { getMessaging } from '@firebase/messaging';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:"styava-demo",
      clientEmail: "firebase-adminsdk-exgn3@styava-demo.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiFpdjVP13u9DD\njdmZZ4KHGYjkvhfPjNNBTgblLX9RalT+q6TfQLuAyyVDBnMUiMrStA+dxtKU2p8q\nTWM/g6rgZ8LPoverurtZ+m/Fa0YfPN5SxiBdn1nREQ4Gw9Mi3Pj4JO4nuVL5e+OF\nF+8wj3UoTl5vfhw1dWCbdL/vj+DbYkk7CMg8oaR69VrtZ/zTXTb3LDTKU1OGQOwA\n0OC+Jwgs+QlW5yKt3k+VqzxM/RxZmQsbJbtzowu99eetxoT7tQmE+OtbrHyr1Gaw\nIgL+xyahp//pta80EjIJ6HXoxYlMi6XrTtZTlgq6AfxHgIbObODH+u94QWc+fDfd\nblhUFvQhAgMBAAECggEABl4sRqcTygnrUfy2cKaMk71NgKLVhRoib5wQ3+bZh4uj\nB/bB6qtWNKUUIDiH6H/HVaquZ2tcjkZ/leeO2HC/EPm/MA23I9o7MWg3OnRgadwT\nJ3nu2rA0rYmpT1m34ksexI92uT30JzR89qhTS3b47ekSKhn/VaagEVTXHJpc8xTa\nrB82J9lNTDdBZvmPaqhu1RmYojorW8c8wJXx6fj1IY7mrSt1ZucVbd/6r+xyDIy1\nsKNYrbGTmZCfc4GkfuiIQiqM07g3Rt8jexjrUS5A6zLYBboukR72akOS0MAmzz4O\nXz6AjwpJ9WK28ML7j3+pQ/wlJj+Lkj2zbiFwDfnFaQKBgQD3knj4jr1geG43twRR\n3y9zEfdqFMKZjC8+rsfMxfPlTrcG9dwGYQ0uhDFN2V9TZsCnC030RfgpDHLrmXA8\n2vfDrG9pasCUQ814Bp9Y0G1xQOZ0A3b4fZdmOOgFrzTPmmrRItF6iaOZijDB7fsa\nupaKhw7JzqdKegAPihMFuAjJuQKBgQDpyORfSCuQwPBH8ze8d7FdH401G2yNQeDs\nkbe83ilhCGE3VKEkrNwtm58x9DafXD8kejYTjhbh6TdCTonE7B7wEx/hbL8K+rxS\nSzd5KJFX1vxI4tYM6sulYsgEJGuICwLOiQXawGGill6/gquIrzS6rYb5JChTrstt\nrOpNIEiRqQKBgQCwxMrPXsvlN9gqu+i/tIYiuW9ZNR2FmUyaix1qHuV4k22n8KB7\nhYxt7EFv/odL+5APNckhY1w/ov3jLxmuugIymsqqEGkU9ByfWMsqFRgvx1FFALxP\nzQzvFi7E8Eba/LzMOvorbl973+nUbmHewd9/ZdOvUHiuetHURpgyeyb7MQKBgQDe\n32PH6jeOIkFvdlD2XW07B+9IZ8KOz/Ur0qdFaM4t8R0s8INHQXwOBsQ3jUfdmMWh\nctjGv7jU2c6SaekxUKEV4kWMVG20e+C423ghCym0ggG1QnspiVVnb8qbGFVjNowQ\nddSc/LaXl57wGBSLk+xC41c/gNbpIERTZHth15sXMQKBgCrNqZsd72qm/VWUWY9k\nRGHkuiPYwmc209c8QA4fluY4mfyihINjUBgXrBKASh3oRWpYLCUofAjigklJlanp\n7CxgdPtmA5R9UzFytp5oibOPgTUQW5fFrm67kjd8Nsgrl1y7f3yREraaGKYDnBg2\nzyfpbfauo5rjpcXs2KOGID+V\n-----END PRIVATE KEY-----\n"
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all tokens from your realtime database
    const tokensSnapshot = await get(ref(getDatabase(), 'fcmTokens'));
    const tokens = Object.keys(tokensSnapshot.val() || {});

    if (!tokens.length) {
      return res.status(404).json({ error: 'No FCM tokens found' });
    }

    // Get notification data from request body
    const { title, body, imageUrl } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Prepare notification message
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
        imageUrl: imageUrl || '',
      },
      tokens, // Multicast requires an array of tokens
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          icon: '/icon.png',
          badge: '/badge.png',
          vibrate: [100, 50, 100],
          requireInteraction: false,
        },
      },
    };

    // Send the notification using the Messaging instance
    const response = await admin.messaging().sendEachForMulticast({
      notification: {
        title,
        body,
      },
      tokens,
    });

    // Return the results
    return res.status(200).json({
      success: true,
      results: {
        total: response.responses.length,
        successful: response.successCount,
        failed: response.failureCount,
        responses: response.responses,
      },
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    return res.status(500).json({
      error: 'Failed to send notifications',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}