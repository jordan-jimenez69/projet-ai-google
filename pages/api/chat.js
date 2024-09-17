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
  maxOutputTokens: 8192,
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

    const parts = [
      { "text": "input: combien coûtent les équipements de natation ?" },
      { "text": "output: Les prix varient de 15 euros à 100 euros pour nos équipements de natation." },
      { "text": "input: Comment entretenir mon maillot de bain ?" },
      { "text": "output: Il est conseillé de le rincer à l'eau froide après chaque utilisation et de le laver à la main." },
      { "text": "input: Quel est le délai de livraison ?" },
      { "text": "output: La livraison prend entre 3 et 5 jours." },
      { "text": "input: combien coûte des palmes de natation ?" },
      { "text": "output: Nous proposons des palmes à partir de 25 euros." },
      { "text": "input: tu sers à quoi ?" },
      { "text": "output: Je suis un chatbot pour vous orienter dans le choix de vos équipements de natation disponibles sur notre site." },
      { "text": "input: avez-vous des maillots de bain pour femme ?" },
      { "text": "output: Nous proposons plusieurs modèles de maillots de bain pour femme, avec des prix allant de 20 à 60 euros." },
      { "text": "input: puis-je obtenir des lunettes de natation sur votre site ?" },
      { "text": "output: Oui, nous avons des lunettes de natation disponibles à partir de 10 euros." },
      { "text": "input: quels sont les frais de livraison ?" },
      { "text": "output: Les frais de livraison sont de 5 euros pour toute commande inférieure à 50 euros, et gratuits au-delà." },
      { "text": "input: Comment puis-je retourner un article ?" },
      { "text": "output: Vous pouvez retourner tout article sous 30 jours, à condition qu'il soit non utilisé et dans son emballage d'origine." },
      { "text": "input: y a-t-il des réductions pour les membres ?" },
      { "text": "output: Oui, les membres bénéficient de 10 % de réduction sur toutes les commandes." },
      { "text": "input: Combien coûtent les bonnets de bain ?" },
      { "text": "output: Nos bonnets de bain commencent à 8 euros et peuvent aller jusqu'à 25 euros." },
      { "text": "input: Quel est le délai de remboursement après un retour ?" },
      { "text": "output: Le remboursement est traité sous 5 à 10 jours ouvrables après réception du retour." },
      { "text": "input: Puis-je acheter des accessoires pour l'entraînement de natation ?" },
      { "text": "output: Oui, nous proposons une gamme complète d'accessoires pour l'entraînement, comme les plaquettes et les planches." },
      { "text": "input: Avez-vous des équipements pour enfants ?" },
      { "text": "output: Nous proposons une large gamme d'équipements de natation pour enfants, incluant des maillots, lunettes et bonnets." },
      { "text": "input: Où sont fabriqués vos produits ?" },
      { "text": "output: La majorité de nos produits sont fabriqués en Europe, avec un souci de qualité et de durabilité." },
      { "text": "input: Puis-je suivre ma commande ?" },
      { "text": "output: Oui, après l'expédition, vous recevrez un lien de suivi par e-mail pour suivre votre commande." },
      { "text": "input: Avez-vous des maillots de compétition ?" },
      { "text": "output: Nous proposons des maillots de bain de compétition adaptés aux nageurs professionnels." },
      { "text": "input: Avez-vous des serviettes de bain pour la piscine ?" },
      { "text": "output: Oui, nous proposons des serviettes ultra-absorbantes spécialement conçues pour les nageurs." }
    ];

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
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

    

  } else if (req.method === 'GET') {
 
      const fileData = fs.readFileSync(filePath);
      const json = JSON.parse(fileData);
      res.status(200).json(json);
    } 
}