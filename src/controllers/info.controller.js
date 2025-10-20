export const getHomeInfo = (req, res) => {
  res.json({
    title: "Jeux Olympiques - France 2024",
    subtitle: "Réservez vos billets officiels dès maintenant",
    description:
      "Bienvenue sur le site officiel de réservation des billets pour les Jeux Olympiques de France. Choisissez votre offre et réservez en toute sécurité.",
    imageUrl:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=60",
  });
};
