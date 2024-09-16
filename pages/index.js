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
      <h1>Generation d'une rando en France</h1>
      <button onClick={generateStory} disabled={loading}>
        {loading ? 'Generation de la randonné...' : 'Generation Rando'}
      </button>
      <p>{text}</p>
    </div>
  );
}