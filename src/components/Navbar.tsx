import logo from "../assets/logo.jpeg";
import { CreditCard, Heart, MessageCircle, Search, User, MoreHorizontal, Settings, Shield, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { API } from "@/lib/api";

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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : {};
  const isAdmin = user.role === 'admin';
 
  // Global Profile Sync: Keeps role and plan updated across the app
  useEffect(() => {
    const syncProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Global profile sync failed:", err);
      }
    };
    syncProfile();
  }, [pathname]); // Refresh on every page navigation for maximum accuracy

  const fullNavItems = [
    ...navItems,
    { to: "/settings", icon: Settings, label: "Paramètres" },
    { to: "/terms", icon: Shield, label: "Conditions" },
  ];

  if (isAdmin) {
    fullNavItems.push({ to: "/admin", icon: LayoutDashboard, label: "Dashboard Admin" });
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("matchPrefs");
    toast.success("Vous avez été déconnecté.");
    navigate("/auth");
    setIsOpen(false);
  };

  const mobileNavItems = [
    { to: "/", icon: Heart, label: "Accueil" },
    { to: "/discover", icon: Search, label: "Découvrir" },
    { to: "/messages", icon: MessageCircle, label: "Messages" },
    { to: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <>
      {/* Desktop & Mobile Header Branding */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Amour Et Sincerité logo" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-xl font-black tracking-tighter text-foreground">
              Amour Et Sincerité<span className="text-primary">.</span>
            </span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="text-2xl font-black tracking-tighter">Menu<span className="text-primary">.</span></SheetTitle>
                <SheetDescription>Explorez Amour Et Sincérité</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {fullNavItems.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${active
                          ? "bg-primary/10 text-primary font-bold"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <item.icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  );
                })}
                <hr className="my-4 border-border/50" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/5 transition-all text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-base font-semibold">Se déconnecter</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-lg md:top-0 md:bottom-auto">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 md:py-3">
          <Link to="/" className="hidden items-center gap-2 md:flex">
            <img src={logo} alt="Amour Et Sincerité logo" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-2xl font-black tracking-tighter text-foreground whitespace-nowrap">
              Amour Et Sincerité<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Links (all navItems) */}
          <div className="hidden md:flex md:gap-1 md:ml-8">
            {([...navItems, (isAdmin ? { to: "/admin", icon: LayoutDashboard, label: "Admin" } : null)].filter(Boolean) as any[]).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm transition-colors ${active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Bottom Bar (4 items + More) */}
          <div className="flex w-full justify-between items-center md:hidden px-2">
            {mobileNavItems.map(({ to, icon: Icon, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors ${active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setIsOpen(true)}
              className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <MoreHorizontal className="h-6 w-6" />
              <span>Plus</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

