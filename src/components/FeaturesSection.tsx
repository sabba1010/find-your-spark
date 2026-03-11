import { MessageCircle, Heart, Search, Video } from "lucide-react";

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Matching Intelligent",
    description: "Notre algorithme avancé vous met en relation avec des personnes qui partagent vos centres d'intérêt.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Messagerie Sécurisée",
    description: "Lancez une conversation instantanément grâce à notre plateforme de chat fluide and privée.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Profils Vérifiés",
    description: "Naviguez en toute confiance en sachant que notre équipe vérifie manuellement chaque profil.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Pourquoi Choisir <span className="text-primary">Amour Et Sincerité ?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-medium">
            Nous fournissons les outils et la sécurité dont vous avez besoin pour trouver une connexion significative dans le monde des rencontres modernes.
          </p>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-[2.5rem] border border-border bg-card p-10 text-center transition-all hover:shadow-xl hover:-translate-y-2 hover:border-primary/20"
            >
              <div className="mb-6 rounded-3xl bg-primary/10 p-5 transition-colors group-hover:bg-primary/20">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed italic">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
