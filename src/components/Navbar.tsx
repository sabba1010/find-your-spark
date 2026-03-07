import { Heart, MessageCircle, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Heart, label: "Home" },
  { to: "/discover", icon: Search, label: "Discover" },
  { to: "/messages", icon: MessageCircle, label: "Messages" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-lg md:top-0 md:bottom-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 md:py-3">
        <Link to="/" className="hidden items-center gap-2 md:flex">
          <Heart className="h-6 w-6 fill-primary text-primary" />
          <span className="text-xl font-bold text-foreground">Heartbeat</span>
        </Link>
        <div className="flex w-full justify-around md:w-auto md:gap-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 text-xs transition-colors md:flex-row md:gap-2 md:text-sm ${active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
