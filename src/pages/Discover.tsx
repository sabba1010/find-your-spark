import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export interface MatchedUser {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: "man" | "woman";
  photo: string;
  bio: string;
  matchPercent?: number;
}

export default function Discover() {
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        navigate("/auth");
        return;
      }

      try {
        const prefs = JSON.parse(localStorage.getItem("matchPrefs") || "{}");
        const ageParam = prefs.ageRange ? `?ageRange=${encodeURIComponent(prefs.ageRange)}` : "";

        const res = await fetch(`${API}/users/matches${ageParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/auth");
            return;
          }
          throw new Error(data.message);
        }

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const isFree = currentUser.planName === 'Free Registration' || !currentUser.planName;

        setMatches(isFree ? data.matches.slice(0, 5) : data.matches);

        if (isFree && data.matches.length > 5) {
          toast.info("Passez au Premium pour voir tous les profils !", {
            action: {
              label: "En savoir plus",
              onClick: () => navigate("/plans")
            }
          });
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Recherche de profils...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:pt-20">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Vos Profils</h1>
      <p className="mb-6 text-sm text-muted-foreground">{matches.length} profil{matches.length !== 1 ? "s" : ""} trouvé{matches.length !== 1 ? "s" : ""}</p>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">Aucun profil trouvé pour vos préférences.</p>
          <a href="/match-setup" className="mt-4 text-sm font-medium text-primary hover:underline">
            Mettre à jour vos préférences
          </a>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
          {matches.map((user) => (
            <ProfileCard key={user.id} user={user} matchPercent={user.matchPercent} />
          ))}
        </div>
      )}
    </div>
  );
}
