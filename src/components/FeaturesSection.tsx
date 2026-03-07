import { MessageCircle, Heart, Search, Video } from "lucide-react";

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Matching Intelligent",
    description: "Notre algorithme avancé vous met en relation avec des personnes qui partagent vos centres d'intérêt et vos valeurs.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Messagerie en Temps Réel",
    description: "Lancez une conversation instantanément grâce à notre plateforme de chat fluide et sécurisée.",
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Rendez-vous Vidéo",
    description: "Connectez-vous face à face dans le confort de votre maison avec des appels vidéo de haute qualité.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Profils Vérifiés",
    description: "Naviguez en toute confiance en sachant que notre équipe vérifie manuellement chaque profil.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pourquoi Choisir Heartbeat ?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Nous fournissons les outils et la sécurité dont vous avez besoin pour trouver une connexion significative dans le monde des rencontres modernes.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-md"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
