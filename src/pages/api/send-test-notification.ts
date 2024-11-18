import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:"styava-demo",
      clientEmail: "firebase-adminsdk-exgn3@styava-demo.iam.gserviceaccount.com",
      privateKey:  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiFpdjVP13u9DD\njdmZZ4KHGYjkvhfPjNNBTgblLX9RalT+q6TfQLuAyyVDBnMUiMrStA+dxtKU2p8q\nTWM/g6rgZ8LPoverurtZ+m/Fa0YfPN5SxiBdn1nREQ4Gw9Mi3Pj4JO4nuVL5e+OF\nF+8wj3UoTl5vfhw1dWCbdL/vj+DbYkk7CMg8oaR69VrtZ/zTXTb3LDTKU1OGQOwA\n0OC+Jwgs+QlW5yKt3k+VqzxM/RxZmQsbJbtzowu99eetxoT7tQmE+OtbrHyr1Gaw\nIgL+xyahp//pta80EjIJ6HXoxYlMi6XrTtZTlgq6AfxHgIbObODH+u94QWc+fDfd\nblhUFvQhAgMBAAECggEABl4sRqcTygnrUfy2cKaMk71NgKLVhRoib5wQ3+bZh4uj\nB/bB6qtWNKUUIDiH6H/HVaquZ2tcjkZ/leeO2HC/EPm/MA23I9o7MWg3OnRgadwT\nJ3nu2rA0rYmpT1m34ksexI92uT30JzR89qhTS3b47ekSKhn/VaagEVTXHJpc8xTa\nrB82J9lNTDdBZvmPaqhu1RmYojorW8c8wJXx6fj1IY7mrSt1ZucVbd/6r+xyDIy1\nsKNYrbGTmZCfc4GkfuiIQiqM07g3Rt8jexjrUS5A6zLYBboukR72akOS0MAmzz4O\nXz6AjwpJ9WK28ML7j3+pQ/wlJj+Lkj2zbiFwDfnFaQKBgQD3knj4jr1geG43twRR\n3y9zEfdqFMKZjC8+rsfMxfPlTrcG9dwGYQ0uhDFN2V9TZsCnC030RfgpDHLrmXA8\n2vfDrG9pasCUQ814Bp9Y0G1xQOZ0A3b4fZdmOOgFrzTPmmrRItF6iaOZijDB7fsa\nupaKhw7JzqdKegAPihMFuAjJuQKBgQDpyORfSCuQwPBH8ze8d7FdH401G2yNQeDs\nkbe83ilhCGE3VKEkrNwtm58x9DafXD8kejYTjhbh6TdCTonE7B7wEx/hbL8K+rxS\nSzd5KJFX1vxI4tYM6sulYsgEJGuICwLOiQXawGGill6/gquIrzS6rYb5JChTrstt\nrOpNIEiRqQKBgQCwxMrPXsvlN9gqu+i/tIYiuW9ZNR2FmUyaix1qHuV4k22n8KB7\nhYxt7EFv/odL+5APNckhY1w/ov3jLxmuugIymsqqEGkU9ByfWMsqFRgvx1FFALxP\nzQzvFi7E8Eba/LzMOvorbl973+nUbmHewd9/ZdOvUHiuetHURpgyeyb7MQKBgQDe\n32PH6jeOIkFvdlD2XW07B+9IZ8KOz/Ur0qdFaM4t8R0s8INHQXwOBsQ3jUfdmMWh\nctjGv7jU2c6SaekxUKEV4kWMVG20e+C423ghCym0ggG1QnspiVVnb8qbGFVjNowQ\nddSc/LaXl57wGBSLk+xC41c/gNbpIERTZHth15sXMQKBgCrNqZsd72qm/VWUWY9k\nRGHkuiPYwmc209c8QA4fluY4mfyihINjUBgXrBKASh3oRWpYLCUofAjigklJlanp\n7CxgdPtmA5R9UzFytp5oibOPgTUQW5fFrm67kjd8Nsgrl1y7f3yREraaGKYDnBg2\nzyfpbfauo5rjpcXs2KOGID+V\n-----END PRIVATE KEY-----\n"
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
    const { token } = req.body;

    const message = {
      notification: {
        title: 'Test Notification',
        body: 'This is a test notification from your app!',
      },
      token,
    };

    const response = await admin.messaging().send(message);
    return res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
}