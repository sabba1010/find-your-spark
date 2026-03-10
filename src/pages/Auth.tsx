import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const API = "https://datting-backend.vercel.app/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
      const body: Record<string, any> = { email: form.email, password: form.password };
      if (!isLogin) {
        body.name = form.name;
        body.age = parseInt(form.age, 10);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Une erreur est survenue.");
        return;
      }

      // Persist auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(isLogin ? "Bon retour parmi nous ! 💕" : "Compte créé ! Trouvons votre match 🎉");

      // If profile is already set up (has gender), go to discover, else go to setup
      if (data.user.gender) {
        navigate("/discover");
      } else {
        navigate("/match-setup");
      }
    } catch {
      toast.error("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
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
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Prénom</Label>
                <Input id="name" type="text" placeholder="Emma" required value={form.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input id="age" type="number" min={18} max={99} placeholder="25" required value={form.age} onChange={handleChange} />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="••••••••" required value={form.password} onChange={handleChange} />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Chargement..." : isLogin ? "Se Connecter" : "Créer un Compte"}
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
