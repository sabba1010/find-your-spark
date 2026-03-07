import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Heart, MapPin, Edit, Settings, LogOut, Shield, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fakeUsers } from "@/data/users";
import { toast } from "sonner";

interface UserPrefs {
    gender: string;
    lookingFor: string;
    ageRange: string;
    location: string;
    profilePic: string | null;
}

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prefs, setPrefs] = useState<UserPrefs | null>(null);
    const [publicUser, setPublicUser] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const user = fakeUsers.find(u => u.id === id);
            if (user) {
                setPublicUser(user);
            }
        } else {
            const raw = localStorage.getItem("matchPrefs");
            if (raw) {
                setPrefs(JSON.parse(raw));
            }
        }
    }, [id]);

    const isOwnProfile = !id;
    const userName = isOwnProfile ? "Sabba" : publicUser?.name;
    const userBio = isOwnProfile
        ? "Passionné par la création de belles interfaces et la recherche de connexions significatives. J'aime le café, les voyages et la technologie."
        : publicUser?.bio;
    const displayPic = isOwnProfile
        ? (prefs?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop")
        : publicUser?.photo;
    const location = isOwnProfile ? (prefs?.location || "Paris, France") : publicUser?.location;

    if (id && !publicUser) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold text-foreground">Utilisateur non trouvé</h2>
                <p className="text-muted-foreground mt-2">Le profil que vous recherchez n'existe pas.</p>
                <Button className="mt-6" asChild>
                    <Link to="/discover">Retour à Découvrir</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20 md:pt-16">
            {/* Header / Cover */}
            <div className="relative h-48 w-full bg-gradient-to-r from-rose-500 to-primary md:h-64">
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Profile Info Card */}
            <div className="mx-auto -mt-20 max-w-4xl px-4 relative z-10">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div className="relative">
                                <img
                                    src={displayPic}
                                    alt="Profile"
                                    className="h-32 w-32 rounded-3xl border-4 border-card object-cover shadow-lg md:h-40 md:w-40"
                                />
                                <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-1.5 border-4 border-card">
                                    <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                                </div>
                            </div>
                            <div className="pb-2">
                                <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                                    {userName}<span className="text-rose-500">.</span>
                                </h1>
                                <p className="flex items-center justify-center md:justify-start gap-1 text-muted-foreground font-medium mt-1">
                                    <MapPin className="h-4 w-4" />
                                    {location}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center">
                            {isOwnProfile ? (
                                <>
                                    <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold" asChild>
                                        <Link to="/match-setup">
                                            <Edit className="mr-2 h-4 w-4" /> Modifier le Profil
                                        </Link>
                                    </Button>
                                    <Button size="lg" className="rounded-xl font-bold shadow-lg shadow-primary/20">
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="lg" className="rounded-xl font-bold bg-primary px-8" onClick={() => toast.success(`Vous avez aimé ${userName} ! 💕`)}>
                                        <Heart className="mr-2 h-5 w-5 fill-current" /> J'aime
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold" onClick={() => navigate(`/messages?user=${id}`)}>
                                        <MessageCircle className="mr-2 h-5 w-5" /> Message
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-4">À propos de {isOwnProfile ? 'moi' : userName}</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {userBio}
                                </p>
                            </div>

                            {!isOwnProfile && (
                                <div>
                                    <h2 className="text-xl font-bold text-foreground mb-4">Infos Rapides</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Âge</p>
                                            <p className="text-lg font-bold text-foreground">{publicUser?.age} ans</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Genre</p>
                                            <p className="text-lg font-bold text-foreground capitalize">{publicUser?.gender === 'man' ? 'Homme' : 'Femme'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isOwnProfile && (
                                <div>
                                    <h2 className="text-xl font-bold text-foreground mb-4">Mes Préférences</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { label: "Je suis", value: (prefs?.gender === 'man' ? 'Homme' : (prefs?.gender === 'woman' ? 'Femme' : 'Non spécifié')) },
                                            { label: "Recherche", value: (prefs?.lookingFor === 'man' ? 'Homme' : (prefs?.lookingFor === 'woman' ? 'Femme' : 'Non spécifié')) },
                                            { label: "Tranche d'âge", value: prefs?.ageRange || "Non spécifié" },
                                            { label: "Lieu", value: prefs?.location || "Non spécifié" },
                                        ].map((attr, i) => (
                                            <div key={i} className="flex items-center justify-between rounded-2xl bg-muted/50 p-4 border border-border/50">
                                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{attr.label}</span>
                                                <span className="font-bold text-foreground capitalize">{attr.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-primary/20 p-3">
                                        <Shield className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-lg mb-1">Restez en Sécurité</h3>
                                        <p className="text-muted-foreground">Suivez toujours nos conseils de communauté et donnez la priorité à votre sécurité lors de rencontres avec de nouvelles personnes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {isOwnProfile ? (
                                <div className="rounded-2xl border border-border bg-card p-6">
                                    <h3 className="font-bold text-foreground mb-4">Menu</h3>
                                    <nav className="space-y-2">
                                        {[
                                            { label: "Paramètres du Compte", icon: Settings },
                                            { label: "Conditions d'Utilisation", icon: Shield },
                                            { label: "Se Déconnecter", icon: LogOut, danger: true },
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-muted ${item.danger ? 'text-rose-500' : 'text-foreground'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 opacity-30" />
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-border bg-card p-6">
                                    <h3 className="font-bold text-foreground mb-4">Centres d'Intérêt</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { en: "Travel", fr: "Voyage" },
                                            { en: "Music", fr: "Musique" },
                                            { en: "Coffee", fr: "Café" },
                                            { en: "Fitness", fr: "Fitness" },
                                            { en: "Art", fr: "Art" }
                                        ].map((interest, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                                                #{interest.fr}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl bg-gradient-to-br from-primary to-rose-600 p-6 text-white shadow-lg shadow-primary/20">
                                <Heart className="h-10 w-10 fill-white mb-4" />
                                <h3 className="text-xl font-bold mb-2">Passer au Premium</h3>
                                <p className="text-white/80 text-sm mb-4">Obtenez des matchs illimités, voyez qui vous aime, et bien plus encore !</p>
                                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12">
                                    Voir les Forfaits
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
