import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public', 'conversations.json');
const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  
      const result = await model.generateContent(message);
      const response = await result.response.text();

      conversation.messages.push({ text: response, sender: 'bot', timestamp: new Date().toISOString() });

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
      res.status(200).json({ reply: response });

  } else if (req.method === 'GET') {
  
      const fileData = fs.readFileSync(filePath);
      const json = JSON.parse(fileData);
      res.status(200).json(json);
    
  } 
}
