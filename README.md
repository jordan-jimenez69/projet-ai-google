Fine-tuning tutorial :

L'affinage sert à améliorer un modèle d'IA pour des tâches précises. Ça marche bien quand les requêtes normales ne suffisent pas. en lui donnant des exemples pour qu'il s'entraîne et réponde mieux.

Le but, c'est d'avoir un modèle qui fait mieux ce que tu veux. Tu lui donne des données pour qu'il apprenne à donner les réponses que tu attends.

Tu dois préparer des données d'entraînement variée et représentatives le format doit être le même entre l'entraînement et ce que tu vas utiliser en production, sinon le modèle pourrait ne pas comprendre.

exemple / 
[
  {"text_input": "Quel est le délai de livraison ?", "output": "La livraison prend entre 3 et 5 jours."},
  {"text_input": "Comment retourner un produit ?", "output": "Vous pouvez retourner un produit sous 30 jours."}
]

Mon bot répond aléatoirement il gere mal les input et output voici un type de réponse 

Input : Salut 
Output : Ce chatbot est très performant pour répondre aux questions sur les équipements de natation. Il fournit des informations précises sur les prix, les délais de livraison, les frais de livraison, les retours, les réductions, les produits disponibles et les informations sur la fabrication. Il est également capable de répondre à des questions plus spécifiques sur les différents types d'équipements, comme les palmes, les lunettes, les bonnets, les maillots de bain pour femmes, les accessoires d'entraînement, les équipements pour enfants, les maillots de compétition et les serviettes de bain. Il est clair, concis et fournit des informations utiles pour les clients potentiels.

Il comprend bien que l'on parle de rando mais il ecrit ce message pour toute les demande que lui fait !

J'ai tenter une autre méthode qui est de donner une instruction a mon bot comme ceci : 

const instruction = "Je suis un chatbot conçu pour vous aider à vous orienter uniquement vers les équipements de randonnée disponibles sur notre site. Nous ne vendons que des équipements de randonnée et je vous conseille sur les meilleurs équipements disponibles.";

const parts = [
  { text: `instruction: ${instruction}` },
  { text: `input: ${message}` }, 
];

const result = await model.generateContent({
  contents: [{ role: 'user', parts }],
  generationConfig,
});

mais malheuresement ca comprend des defaults car on ne pourra pas donner de réponse claire comme le temps de livraison ect.

J'ai trouver une solution pour toute des question spécifique : 

  const handleShoePriceQuestion = (message) => {
    const shoeKeywords = ["chaussure", "chaussures", "rando", "randonnée", "prix"];
    if (shoeKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return "Je ne peux pas donner les prix exacts de nos chaussures, mais elles se situent généralement entre 20 et 200 euros. Consultez notre site web pour connaître les prix actuels.";
    }
    return null; 
  };

  par exemple le fait de si on veut avoir des informations sur notre site en particulier le bot chat vas donner une reponse par rapport au mot clé noté.