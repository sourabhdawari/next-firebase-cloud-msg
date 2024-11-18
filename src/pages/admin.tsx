import { useState } from 'react';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const sendNotification = async () => {
    try {
      setStatus('Sending...');
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus(`Sent to ${data.sent} devices (${data.failed} failed)`);
        setTitle('');
        setBody('');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('Failed to send notification');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send Notifications</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <button
          onClick={sendNotification}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!title || !body}
        >
          Send to All Users
        </button>
        {status && <p className="mt-2">{status}</p>}
      </div>
    </div>
  );
}