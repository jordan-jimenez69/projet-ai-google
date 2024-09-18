import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public', 'conversations.json');
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64, 
    responseMimeType: "text/plain",
  };
  
  const handleShoePriceQuestion = (message) => {
    const shoeKeywords = ["chaussure", "chaussures"];
    if (shoeKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return "Nos chaussures se situent généralement entre 20 et 200 euros. Consulter ici notre catalogue des chaussures";
    }
    return null; 
  };

  const handleTshirtPriceQuestion = (message) => {
    const shoeKeywords = ["t-shirt", "t shirt"];
    if (shoeKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return "Nos t-shirts se situent généralement entre 10 et 30 euros. Consulter ici notre catalogue des t-shirts";
    }
    return null;
};

  export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { message, conversationId } = req.body;
  
      let json;
      try {
        const fileData = fs.readFileSync(filePath);
        json = JSON.parse(fileData);
      } catch (error) {
        json = { conversations: [] };
      }
  
      let conversation = json.conversations.find(c => c.id === conversationId);
      if (!conversation) {
        conversation = { id: conversationId, messages: [] };
        json.conversations.push(conversation);
      }
  
      conversation.messages.push({ text: message, sender: 'user', timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  
      const specificResponse = handleShoePriceQuestion(message) || handleTshirtPriceQuestion(message);

      if (specificResponse) {
        conversation.messages.push({ text: specificResponse, sender: 'bot', timestamp: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        res.status(200).json({ reply: specificResponse });
        return;
      }
  
      const parts = [
        { text: `instruction: Réponds directement avec une suggestion de randonnée basée sur des informations générales. Si l'utilisateur ne fournit pas assez de détails, propose une randonnée classique et courante.` },
        { text: `Voici une liste d'équipements de randonnée pour l'utilisateur : chaussures, bâtons de marche, sacs à dos.` },
        { text: `input: ${message}` },
      ];
  
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig,
      });

    const reponseTexte = await result.response.text();

    conversation.messages.push({
      text: reponseTexte,
      sender: 'bot',
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    res.status(200).json({ reply: reponseTexte });

    console.log("Generated response:", reponseTexte);


  } else if (req.method === 'GET') {
    try {
      const fileData = fs.readFileSync(filePath);
      const json = JSON.parse(fileData);
      res.status(200).json(json);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier de conversations', error);
      res.status(500).json({ error: 'Erreur lors de la lecture des conversations' });
    }
  }
}
