import Head from 'next/head';
import Chatbot from '../composants/chat.js';

export default function Home() {

  return (
    <div>
      <Head>
        <title>Chatbot</title>
        <meta name="description" content="Chatbot application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Bienvenue sur mon générateur de rando, pensez a utilisé mon chatbot</h1>

        <Chatbot />

      </main>
    </div>
  );
}
