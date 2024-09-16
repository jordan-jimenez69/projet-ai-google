import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const apiKey = process.env.API_KEY;
  
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = "Donne moi une randonné a faire en france.";
      const result = await model.generateContent(prompt);

      const response = result.response;
      const text = await response.text();
  
      res.status(200).json({ text });
  }