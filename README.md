Fine-tuning tutorial :

L'affinage sert à améliorer un modèle d'IA pour des tâches précises. Ça marche bien quand les requêtes normales ne suffisent pas. en lui donnant des exemples pour qu'il s'entraîne et réponde mieux.

Le but, c'est d'avoir un modèle qui fait mieux ce que tu veux. Tu lui donne des données pour qu'il apprenne à donner les réponses que tu attends.

Tu dois préparer des données d'entraînement variée et représentatives le format doit être le même entre l'entraînement et ce que tu vas utiliser en production, sinon le modèle pourrait ne pas comprendre.

exemple / 
[
  {"text_input": "Quel est le délai de livraison ?", "output": "La livraison prend entre 3 et 5 jours."},
  {"text_input": "Comment retourner un produit ?", "output": "Vous pouvez retourner un produit sous 30 jours."}
]