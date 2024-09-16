import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessages([...messages, { text: input, sender: 'user' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([...messages, { text: input, sender: 'user' }, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
  };

  return (
    <div>
      <h2>Chatbot</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          Envoyé la demande
        </button>
      </form>
    </div>
  );
}
