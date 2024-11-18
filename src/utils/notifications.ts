import { TokenSaveResponse } from '../types/index';

export const saveUserToken = async (
  userId: string, 
  token: string
): Promise<TokenSaveResponse> => {
  try {
    const response = await fetch('/api/save-notification-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        token,
      }),
    });
    const data: TokenSaveResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving token:', error);
    return { success: false, error: 'Failed to save token' };
  }
};
