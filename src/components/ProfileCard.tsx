import { Heart, MessageCircle, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MatchedUser } from "@/pages/Discover";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { getDefaultAvatar } from "@/lib/utils";
import { API, apiFetch } from "@/lib/api";

export default function ProfileCard({ 
  user, 
  matchPercent, 
  onAction,
  isCompact
}: { 
  user: any; 
  matchPercent?: number;
  onAction?: () => void;
  isCompact?: boolean;
}) {
  const navigate = useNavigate();

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    try {
      const res = await apiFetch(`${API}/users/like/${user.id}`, {
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
      const res = await apiFetch(`${API}/users/pass/${user.id}`, {
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

  if (isCompact) {
    return (
      <Link 
        to={`/profile/${user.id}`}
        className="group flex flex-col items-center gap-2 w-[100px] sm:w-[120px] shrink-0"
      >
        <div className="relative">
          <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-2 border-primary/20 bg-muted/50 transition-all duration-300 group-hover:border-primary group-hover:scale-105 group-hover:shadow-lg">
            <img
              src={user.photo || getDefaultAvatar(user.gender)}
              alt={user.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultAvatar(user.gender);
              }}
            />
          </div>
          {matchPercent != null && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-background bg-primary px-3 py-0.5 text-[11px] font-bold text-white shadow-sm whitespace-nowrap z-10">
              {matchPercent}%
            </div>
          )}
        </div>
        <div className="mt-1 text-center w-full px-1">
          <h3 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">
            {user.name.split(' ')[0]}
          </h3>
          <p className="text-[11px] text-muted-foreground truncate">{user.location}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      {matchPercent != null && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
          {matchPercent}%
        </div>
      )}
      <Link to={`/profile/${user.id}`} className="block aspect-[3/4] overflow-hidden relative">
        <img
          src={user.photo || getDefaultAvatar(user.gender)}
          alt={user.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultAvatar(user.gender);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      <div className="flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <Link to={`/profile/${user.id}`} className="hover:text-primary transition-colors truncate">
              <h3 className="text-lg font-bold text-card-foreground truncate">
                {user.name}, {user.age}
              </h3>
            </Link>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
              <MapPin className="h-3 w-3" />
              {user.location}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors shrink-0"
            onClick={handlePass}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-110 transition-transform shrink-0"
            onClick={handleLike}
          >
            <Heart className="h-6 w-6 fill-current" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-muted-foreground/20 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors shrink-0"
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
