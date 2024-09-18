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
  temperature: 0.15,
  topP: 0.95,
  topK: 64,
  responseMimeType: "text/plain",
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

const instruction = "Je suis un chatbot conçu pour vous aider à vous orienter uniquement vers les équipements de randonnée disponibles sur notre site. Nous ne vendons que des équipements de randonnée et je vous conseille sur les meilleurs équipements disponibles.";

    const parts = [
      { text: `instruction: ${instruction}` },
      { text: `input: ${message}` }, 
    ];

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig,
    });


    const responseText = await result.response.text();

    conversation.messages.push({
      text: responseText,
      sender: 'bot',
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    res.status(200).json({ reply: responseText });

    console.log("Generated response:", responseText);


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
