import Head from 'next/head';
import ChatbotPopup from '../composants/Chatbotpop.js';
import { useState } from 'react';

export default function Home() {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
      const response = await fetch('/api/generate');
      const data = await response.json();
      setText(data.text);
      setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Chatbot</title>
        <meta name="description" content="Chatbot application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Bienvenue sur mon générateur de rando, pensez a utilisé mon chatbot :)</h1>

        <div>
          <button onClick={generateStory} disabled={loading}>
            {loading ? 'Nous recherchons une rando' : 'Rechercher une randonnée'}
          </button>
          <p>{text}</p>
        </div>

        <ChatbotPopup />

      </main>
    </div>
  );
}
