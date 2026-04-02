import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-20 md:pt-24">
            <div className="mb-6 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Conditions d'Utilisation</h1>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 text-muted-foreground leading-relaxed">
                <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    <h2>Accord de l'utilisateur</h2>
                </div>
                
                <section className="space-y-4">
                    <p>
                        Bienvenue sur Amour Et Sincérité. En utilisant nos services, vous acceptez de respecter ces conditions d'utilisation. 
                        Veuillez les lire attentivement car elles constituent un contrat entre vous et notre plateforme.
                    </p>
                </section>

                <section className="space-y-2">
                    <h3 className="font-bold text-foreground">1. Éligibilité</h3>
                    <p>
                        Vous devez avoir au moins 18 ans pour créer un compte et utiliser nos services. En créant un compte, 
                        vous garantissez que vous avez la capacité juridique de conclure ce contrat.
                    </p>
                </section>

                <section className="space-y-2">
                    <h3 className="font-bold text-foreground">2. Code de conduite</h3>
                    <p>
                        Nous attendons de nos utilisateurs qu'ils soient respectueux et honnêtes. Il est interdit de harceler, 
                        d'abuser ou de publier du contenu offensant ou illégal sur la plateforme.
                    </p>
                </section>

                <section className="space-y-2">
                    <h3 className="font-bold text-foreground">3. Sécurité du compte</h3>
                    <p>
                        Vous êtes responsable de la sécurité de votre mot de passe et de toutes les activités effectuées via votre compte. 
                        Informez-nous immédiatement si vous soupçonnez une utilisation non autorisée.
                    </p>
                </section>

                <section className="space-y-2">
                    <h3 className="font-bold text-foreground">4. Signalement</h3>
                    <p>
                        Tout comportement suspect ou violation de ces règles doit être signalé à notre équipe de modération via l'outil de signalement.
                    </p>
                </section>
                
                <div className="pt-6 border-t border-border text-sm italic">
                    Dernière mise à jour : 12 mars 2026
                </div>
            </div>
        </div>
    );
}
