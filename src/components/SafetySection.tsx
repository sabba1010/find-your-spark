import { ShieldCheck, Lock, UserCheck } from "lucide-react";

export default function SafetySection() {
    const safetyFeatures = [
        {
            icon: <ShieldCheck className="h-10 w-10 text-primary" />,
            title: "Votre Sécurité d'Abord",
            description: "Nous utilisons une technologie de pointe combinée à une modération humaine pour assurer la sécurité de notre communauté."
        },
        {
            icon: <Lock className="h-10 w-10 text-primary" />,
            title: "Confidentialité des Données",
            description: "Vos informations personnelles sont cryptées et ne sont jamais partagées sans votre consentement explicite."
        },
        {
            icon: <UserCheck className="h-10 w-10 text-primary" />,
            title: "Membres Vérifiés",
            description: "Cherchez la coche bleue pour savoir que vous parlez à une personne réelle."
        }
    ];

    return (
        <section className="py-20 overflow-hidden">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Rencontrez en toute Confiance et Sécurité
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Chez Amour Et Sincerité, votre sécurité est notre priorité absolue. Nous avons construit une plateforme qui respecte votre vie privée et assure un environnement sécurisé pour des connexions significatives.
                        </p>
                        <div className="space-y-6">
                            {safetyFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-1">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="aspect-square w-full max-w-md mx-auto rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                            <ShieldCheck className="h-48 w-48 text-primary opacity-20 absolute" />
                            <img
                                src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop"
                                alt="Safety"
                                className="relative z-10 w-4/5 h-4/5 object-cover rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
