import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Heart, MapPin, Edit, Settings, LogOut, Shield, ChevronRight, MessageCircle, User, Activity, Sparkles, Moon, Baby, Ruler, Wine, Scissors, Eye, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { API } from "@/lib/api";

interface UserPrefs {
    gender: string;
    lookingFor: string;
    ageRange: string;
    location: string;
    profilePic: string | null;
    photos: string[];
    hobbies?: string;
    favoriteActivities?: string;
    zodiacSign?: string;
    religion?: string;
    children?: string;
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    smoke?: string;
    alcohol?: string;
}

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prefs, setPrefs] = useState<any>(null);
    const [publicUser, setPublicUser] = useState<any>(null);
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            // Fetch public profile from API
            const token = localStorage.getItem("token");
            fetch(`${API}/users/matches`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(r => r.json())
                .then(data => {
                    const found = data.matches?.find((u: any) => u.id === id);
                    setPublicUser(found || null);
                })
                .catch(() => setPublicUser(null))
                .finally(() => setLoading(false));
        } else {
            // Own profile — read from localStorage
            const raw = localStorage.getItem("user");
            const prefs2 = localStorage.getItem("matchPrefs");
            if (raw) {
                const user = JSON.parse(raw);
                const matchPrefs = prefs2 ? JSON.parse(prefs2) : {};
                setPrefs({ ...user, ...matchPrefs });
            }
        }
    }, [id]);

    const isOwnProfile = !id;
    const userName = isOwnProfile ? (prefs?.name || "Mon Profil") : publicUser?.name;
    const userBio = isOwnProfile
        ? (prefs?.bio || "Passionné par la création de belles interfaces et la recherche de connexions significatives.")
        : publicUser?.bio;
    const displayPic = isOwnProfile
        ? (prefs?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop")
        : publicUser?.photo;
    const location = isOwnProfile ? (prefs?.location || "Paris, France") : publicUser?.location;
    const photos = isOwnProfile ? (prefs?.photos || [displayPic]) : (publicUser?.photos || [displayPic]);

    const [activePhoto, setActivePhoto] = useState(0);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

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
            {/* Header / Cover / Photo Carousel */}
            <div className="relative h-64 w-full bg-muted md:h-96">
                {photos.length > 0 ? (
                    <div className="h-full w-full relative overflow-hidden">
                        <img
                            src={photos[activePhoto]}
                            alt={`Photo ${activePhoto + 1}`}
                            className="h-full w-full object-cover transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Dots for carousel */}
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
                            {photos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePhoto(i)}
                                    className={`h-1.5 rounded-full transition-all ${i === activePhoto ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                                />
                            ))}
                        </div>

                        {/* Arrows for carousel */}
                        {photos.length > 1 && (
                            <>
                                <button 
                                    onClick={() => setActivePhoto((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6 rotate-180" />
                                </button>
                                <button 
                                    onClick={() => setActivePhoto((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-full w-full bg-gradient-to-r from-rose-500 to-primary"></div>
                )}
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
                                    className="h-32 w-32 rounded-3xl border-4 border-card object-cover shadow-lg md:h-40 md:w-40 ring-1 ring-black/5"
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
                                        <Link to="/settings">
                                            <Edit className="mr-2 h-4 w-4" /> Modifier le Profil
                                        </Link>
                                    </Button>
                                    <Button size="lg" className="rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                                        <Link to="/settings">
                                            <Settings className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="lg" className="rounded-xl font-bold bg-primary px-8" onClick={() => toast.success(`Vous avez aimé ${userName} ! 💕`)}>
                                        <Heart className="mr-2 h-5 w-5 fill-current" /> J'aime
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold" onClick={() => navigate(`/messages?user=${id}`, {
                                        state: {
                                            userName,
                                            userPhoto: displayPic,
                                            userLocation: location
                                        }
                                    })}>
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

                            {/* Detailed Info Grid */}
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-6">Détails Personnels</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Loisirs", value: (isOwnProfile ? prefs?.hobbies : publicUser?.hobbies), icon: Heart, placeholder: "Ajouter vos loisirs" },
                                        { label: "Activités", value: (isOwnProfile ? prefs?.favoriteActivities : publicUser?.favoriteActivities), icon: Activity, placeholder: "Ajouter des activités" },
                                        { label: "Zodiaque", value: (isOwnProfile ? prefs?.zodiacSign : publicUser?.zodiacSign), icon: Moon, placeholder: "Signe astrologique" },
                                        { label: "Religion", value: (isOwnProfile ? prefs?.religion : publicUser?.religion), icon: Sparkles, placeholder: "Ajouter votre religion" },
                                        { label: "Enfants", value: (isOwnProfile ? (prefs?.children === 'none' ? 'Aucun' : (prefs?.children === 'want' ? 'En veut' : (prefs?.children === 'have' ? 'En a' : (prefs?.children === 'dont_want' ? "N'en veut pas" : prefs?.children)))) : (publicUser?.children === 'none' ? 'Aucun' : (publicUser?.children === 'want' ? 'En veut' : (publicUser?.children === 'have' ? 'En a' : (publicUser?.children === 'dont_want' ? "N'en veut pas" : publicUser?.children))))), icon: Baby, placeholder: "Préférence enfants" },
                                        { label: "Taille", value: (isOwnProfile ? (prefs?.height ? `${prefs.height} cm` : null) : (publicUser?.height ? `${publicUser.height} cm` : null)), icon: Ruler, placeholder: "Ajouter votre taille" },
                                        { label: "Yeux", value: (isOwnProfile ? prefs?.eyeColor : publicUser?.eyeColor), icon: Eye, placeholder: "Couleur des yeux" },
                                        { label: "Cheveux", value: (isOwnProfile ? prefs?.hairColor : publicUser?.hairColor), icon: Scissors, placeholder: "Couleur des cheveux" },
                                        { label: "Fumeur", value: (isOwnProfile ? (prefs?.smoke === 'yes' ? 'Oui' : (prefs?.smoke === 'no' ? 'Non' : (prefs?.smoke === 'occasionally' ? 'Parfois' : null))) : (publicUser?.smoke === 'yes' ? 'Oui' : (publicUser?.smoke === 'no' ? 'Non' : (publicUser?.smoke === 'occasionally' ? 'Parfois' : null)))), icon: Sparkles, placeholder: "Tabac" },
                                        { label: "Alcool", value: (isOwnProfile ? (prefs?.alcohol === 'never' ? 'Jamais' : (prefs?.alcohol === 'socially' ? 'Socialement' : (prefs?.alcohol === 'regularly' ? 'Oui' : null))) : (publicUser?.alcohol === 'never' ? 'Jamais' : (publicUser?.alcohol === 'socially' ? 'Socialement' : (publicUser?.alcohol === 'regularly' ? 'Oui' : null)))), icon: Wine, placeholder: "Alcool" },
                                    ].filter(item => isOwnProfile || item.value).map((item, i) => (
                                        <div key={i} 
                                            onClick={() => isOwnProfile && navigate("/settings")}
                                            className={`flex items-center gap-4 rounded-2xl p-4 border transition-all ${isOwnProfile && !item.value ? 'bg-primary/5 border-dashed border-primary/30 cursor-pointer hover:bg-primary/10' : 'bg-muted/30 border-border/40'}`}
                                        >
                                            <div className={`rounded-full p-2 ${isOwnProfile && !item.value ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                                                <p className={`font-bold text-sm ${!item.value ? 'text-primary/60 italic font-medium' : 'text-foreground'}`}>
                                                    {item.value || item.placeholder}
                                                </p>
                                            </div>
                                            {isOwnProfile && !item.value && (
                                                <ChevronRight className="ml-auto h-4 w-4 text-primary opacity-50" />
                                            )}
                                        </div>
                                    ))}
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
                                            { label: "Paramètres du Compte", icon: Settings, path: "/settings" },
                                            { label: "Conditions d'Utilisation", icon: Shield, path: "/terms" },
                                            { label: "Se Déconnecter", icon: LogOut, danger: true },
                                        ].map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    if (item.danger) {
                                                        localStorage.removeItem("token");
                                                        localStorage.removeItem("user");
                                                        localStorage.removeItem("matchPrefs");
                                                        toast.success("Vous avez été déconnecté.");
                                                        navigate("/auth");
                                                    } else if (item.path) {
                                                        navigate(item.path);
                                                    }
                                                }}
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
                                <h3 className="text-xl font-bold mb-2">
                                    {prefs?.planName || "Passer au Premium"}
                                </h3>
                                <p className="text-white/80 text-sm mb-4">
                                    {prefs?.planName
                                        ? `Votre forfait ${prefs.planName} est actif.`
                                        : "Obtenez des matchs illimités, voyez qui vous aime, et bien plus encore !"}
                                </p>
                                <Button
                                    className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12"
                                    asChild
                                >
                                    <Link to="/plans">Voir les Forfaits</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
