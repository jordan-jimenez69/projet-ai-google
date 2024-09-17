import { useState, useEffect } from 'react';
import ConversationHistory from '@/composants/historique';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const response = await fetch('/api/chat');
    const data = await response.json();
    setConversations(data.conversations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, conversationId: conversationId || Date.now() }),
      });

      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot' };

      setMessages(prevMessages => [...prevMessages, botMessage]);

      if (!conversationId) {
        setConversationId(Date.now());
      }

      setInput('');

      await fetchConversations();

    } catch (error) {
      console.error('Erreur lors de la communication avec API', error);
    }
  };

  const loadConversation = (id) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setMessages(conv.messages);
      setConversationId(id);
    }
  };

  const startNewConversation = async () => {
    setMessages([]);
    const newId = Date.now();
    setConversationId(newId);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: '', conversationId: newId }),
      });

      await fetchConversations();

    } catch (error) {
      console.error('Erreur lors de la création d\'une nouvelle conversation', error);
    }
  };

  return (

    <div className="chatbotContainer">
    {/* Section Historique*/}
    <div className="histoContainer">
      <ConversationHistory
        conversations={conversations}
        loadConversation={loadConversation}
        startNewConversation={startNewConversation}
      />
    </div>
     
  <div className="chatContainer">
    {/* messages */}
    <div className="messagesContainer">
      {messages.map((msg, index) => (
        <div key={index} className={msg.sender === 'user' ? 'userMessage' : 'botMessage'}>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>

    {/* Formulaire d'envoi */}
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input"
        placeholder="Tapez votre message ici..."
      />
      <button type="submit" className="button">Envoyer</button>
    </form>
  </div>
    </div >
  );
}