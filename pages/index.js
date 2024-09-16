import Head from 'next/head';
import Chatbot from '../composants/chat.js';

export default function Home() {

  return (
    <div>
      <Head>
        <title>Chatbot</title>
        <meta name="description" content="Chatbot application" />
      </Head>

      <main>

        <Chatbot />

      </main>
    </div>
  );
}
