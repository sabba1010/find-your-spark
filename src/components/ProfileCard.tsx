import { Heart, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/data/users";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfileCard({ user }: { user: User }) {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={user.photo}
          alt={user.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            {user.name}, {user.age}
          </h3>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {user.location}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => {
              toast.success(`You liked ${user.name}! 💕`);
            }}
          >
            <Heart className="mr-1 h-4 w-4" /> Like
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/messages")}
          >
            <MessageCircle className="mr-1 h-4 w-4" /> Message
          </Button>
        </div>
      </div>
    </div>
  );
}
