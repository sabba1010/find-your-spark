import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { API } from "@/lib/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Vérification de votre compte en cours...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API}/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Votre email a été vérifié !");
          toast.success("Succès ! Vous pouvez maintenant vous connecter.");
        } else {
          setStatus("error");
          setMessage(data.message || "Le lien de vérification est invalide ou a expiré.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Une erreur est survenue lors de la vérification.");
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-xl border border-border">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Vérification...</h1>
            <p className="text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Email Vérifié !</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild className="mt-6 w-full rounded-full">
              <Link to="/auth">Se connecter</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Erreur de Vérification</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild variant="outline" className="mt-6 w-full rounded-full">
              <Link to="/auth">Retour à l'accueil</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
