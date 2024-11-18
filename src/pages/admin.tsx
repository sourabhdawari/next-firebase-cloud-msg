import { useState } from 'react';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body, imageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Notification sent successfully! ${data.results.successful} sent successfully.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessage('An error occurred while sending the notification.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="admin-notification-form">
    <h2>Send Notification</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="imageUrl">Image URL (Optional)</label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Notification'}
      </button>
    </form>
    {message && <p>{message}</p>}
  </div>
  );
}