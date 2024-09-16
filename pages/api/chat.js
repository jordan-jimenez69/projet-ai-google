import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const apiKey = process.env.API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  if (req.method === 'POST') {
    const { message } = req.body;

      const result = await model.generateContent(message);
      const response = await result.response.text();
      res.status(200).json({ reply: response });
  
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method}`);
  }
}
