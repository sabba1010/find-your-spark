import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { API } from "@/lib/api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Votre mot de passe a été réinitialisé ! 🎉");
            setTimeout(() => navigate("/auth"), 2000);
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de la réinitialisation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
                <div className="mb-6 text-center">
                    <Heart className="mx-auto mb-2 h-10 w-10 fill-primary text-primary" />
                    <h1 className="text-2xl font-bold text-card-foreground">Nouveau mot de passe</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Entrez votre nouveau mot de passe ci-dessous</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="password">Nouveau mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Chargement..." : "Réinitialiser"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
