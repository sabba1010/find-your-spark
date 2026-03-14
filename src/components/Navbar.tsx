import logo from "../assets/logo.jpeg";
import { CreditCard, Heart, MessageCircle, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Heart, label: "Accueil" },
  { to: "/discover", icon: Search, label: "Découvrir" },
  { to: "/affinities", icon: Heart, label: "Matchs" },
  { to: "/plans", icon: CreditCard, label: "Plans" },
  { to: "/messages", icon: MessageCircle, label: "Messages" },
  { to: "/profile", icon: User, label: "Profil" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === 'admin';

  const displayNavItems = isAdmin
    ? [...navItems, { to: "/admin", icon: Search, label: "Admin" }]
    : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-lg md:top-0 md:bottom-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 md:py-3">
        <Link to="/" className="hidden items-center gap-2 md:flex">
          <img src={logo} alt="Amour Et Sincerité logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-2xl font-black tracking-tighter text-foreground whitespace-nowrap">
            Amour Et Sincerité<span className="text-primary">.</span>
          </span>
        </Link>
        <div className="flex w-full justify-around md:w-auto md:gap-1 md:ml-8">
          {displayNavItems.map(({ to, icon: Icon, label }) => {
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
