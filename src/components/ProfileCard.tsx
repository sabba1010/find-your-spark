import { Heart, MessageCircle, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MatchedUser } from "@/pages/Discover";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { API } from "@/lib/api";

export default function ProfileCard({ 
  user, 
  matchPercent, 
  onAction 
}: { 
  user: any; 
  matchPercent?: number;
  onAction?: () => void;
}) {
  const navigate = useNavigate();

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    try {
      const res = await fetch(`${API}/users/like/${user.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (data.isMatch) {
          toast.success("C'est un Match ! 🎉 Vous pouvez maintenant vous envoyer des messages.");
        } else {
          toast.success(`Vous avez aimé ${user.name} ! 💕`);
        }
        if (onAction) onAction();
      }
    } catch (err) {
      toast.error("Erreur lors du like.");
    }
  };

  const handlePass = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    try {
      const res = await fetch(`${API}/users/pass/${user.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.info(`Profil de ${user.name} ignoré.`);
        if (onAction) onAction();
      }
    } catch (err) {
      toast.error("Erreur.");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      {matchPercent != null && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
          {matchPercent}% de compatibilité
        </div>
      )}
      <Link to={`/profile/${user.id}`} className="block aspect-[3/4] overflow-hidden relative">
        <img
          src={user.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
          alt={user.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between gap-1">
          <Link to={`/profile/${user.id}`} className="hover:text-primary transition-colors truncate">
            <h3 className="text-lg font-bold text-card-foreground">
              {user.name}, {user.age}
            </h3>
          </Link>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
            <MapPin className="h-3 w-3" />
            {user.location}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
            onClick={handlePass}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
            onClick={handleLike}
          >
            <Heart className="h-6 w-6 fill-current" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-muted-foreground/20 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
            onClick={() => navigate(`/messages?user=${user.id}`, {
              state: { userName: user.name, userPhoto: user.photo, userLocation: user.location }
            })}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
