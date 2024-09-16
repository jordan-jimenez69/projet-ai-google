import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessages([...messages, { text: input, sender: 'user' }]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages([...messages, { text: input, sender: 'user' }, { text: data.reply, sender: 'bot' }]);

    setInput('');
  };

  return (
    <div className="chatbotContainer">
      <h2 className="header">Chatbot</h2>
      <div className="messagesContainer">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
          placeholder="Tapez votre message ici..."
        />
        <button type="submit" className="button">
          Envoyer
        </button>
      </form>
    </div>
  );
}
