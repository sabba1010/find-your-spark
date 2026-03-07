import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Bon retour parmi nous ! 💕" : "Compte créé ! Trouvons votre match 🎉");
    navigate("/match-setup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-20 md:pt-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Heart className="mx-auto mb-2 h-10 w-10 fill-primary text-primary" />
          <h1 className="text-2xl font-bold text-card-foreground">
            {isLogin ? "Bon retour parmi nous" : "Créez votre compte"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? "Connectez-vous pour continuer" : "Commencez votre voyage vers l'amour"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Je suis</Label>
                  <select id="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="woman">Une femme</option>
                    <option value="man">Un homme</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="looking">Recherche</Label>
                  <select id="looking" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="man">Un homme</option>
                    <option value="woman">Une femme</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Âge</Label>
                  <Input id="age" type="number" min={18} max={99} placeholder="25" required />
                </div>
                <div>
                  <Label htmlFor="location">Ville/Lieu</Label>
                  <Input id="location" placeholder="Paris" required />
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" size="lg">
            {isLogin ? "Se Connecter" : "Créer un Compte"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? "S'inscrire" : "Se Connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
