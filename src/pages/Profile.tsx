import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Share2, Heart, MapPin, Edit, Settings, LogOut, Shield, ChevronRight, MessageCircle, User, Activity, Sparkles, Moon, Baby, Ruler, Wine, Scissors, Eye, GraduationCap, UserX, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getDefaultAvatar } from "@/lib/utils";

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
    const [showGallery, setShowGallery] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const openGallery = (index: number) => {
        setGalleryIndex(index);
        setShowGallery(true);
    };

    useEffect(() => {
        if (id) {
            // Fetch public profile from API
            const token = localStorage.getItem("token");
            fetch(`${API}/users/profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        setPublicUser(data.user);
                    } else {
                        setPublicUser(null);
                    }
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

    const handleShare = () => {
        const shareUrl = "https://amour-et-sincerite.com/";
        
        if (navigator.share) {
            navigator.share({
                title: `Amour et Sincérité`,
                text: `Découvrez Amour et Sincérité !`,
                url: shareUrl,
            }).catch(() => {
                // Fallback to clipboard
                navigator.clipboard.writeText(shareUrl);
                toast.success("Lien de l'accueil copié !");
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Lien de l'accueil copié !");
        }
    };

    const handleLike = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/auth");

        try {
            const res = await fetch(`${API}/users/like/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                if (data.isMatch) {
                    toast.success("C'est un Match ! 🎉");
                } else {
                    toast.success(`Vous avez aimé ${userName} ! 💕`);
                }
            }
        } catch (err) {
            toast.error("Erreur lors du like.");
        }
    };

    const handleBlock = async () => {
        setShowBlockConfirm(true);
    };

    const confirmBlock = async () => {
        setShowBlockConfirm(false);

        const token = localStorage.getItem("token");
        if (!token) return navigate("/auth");

        try {
            const res = await fetch(`${API}/users/block/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${userName} a été bloqué.`);
                navigate("/discover");
            }
        } catch (err) {
            toast.error("Erreur lors du blocage.");
        }
    };

    const handleReport = () => {
        setShowReportModal(true);
    };

    const submitReport = async () => {
        if (!reportReason.trim()) {
            toast.error("Veuillez saisir une raison.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return navigate("/auth");

        try {
            const res = await fetch(`${API}/users/report`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reportedUserId: id, reason: reportReason })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Signalement envoyé. Merci de nous aider à garder la communauté sûre.");
                setShowReportModal(false);
                setReportReason("");
            }
        } catch (err) {
            toast.error("Erreur lors du signalement.");
        }
    };

    const isOwnProfile = !id;
    const isAdmin = prefs?.role === 'admin';
    const userName = isOwnProfile ? (prefs?.name || "Mon Profil") : publicUser?.name;
    
    // Safety check: plan might be an ID or an object
    const getPlanName = () => {
        if (isAdmin) return "Admin Lifetime";
        if (!isOwnProfile && publicUser?.planName) return publicUser.planName;
        if (prefs?.plan && typeof prefs.plan === 'object') return prefs.plan.name;
        return prefs?.planName || "Gratuit";
    };

    const userBio = isOwnProfile
        ? (prefs?.bio || "Passionné par la création de belles interfaces et la recherche de connexions significatives.")
        : publicUser?.bio;
    const displayPic = isOwnProfile
        ? (prefs?.photo || getDefaultAvatar(prefs?.gender))
        : (publicUser?.photo || getDefaultAvatar(publicUser?.gender));
    const location = isOwnProfile ? (prefs?.location || "Paris, France") : publicUser?.location;
    const rawPhotos = isOwnProfile ? (prefs?.photos || []) : (publicUser?.photos || []);
    
    // Create a master gallery ensuring displayPic is always included, usually at index 0.
    const allGalleryPhotos = Array.from(new Set([displayPic, ...rawPhotos].filter(Boolean)));
    // For the cover banner specifically, we can use the raw uploaded photos or the master list.
    const coverPhotos = rawPhotos.length > 0 ? rawPhotos : [displayPic];

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
        <div className="min-h-screen bg-muted/30 pt-14 pb-20 md:pt-16">
            {/* Header / Cover / Photo Carousel */}
            <div className="relative h-64 w-full bg-muted md:h-96">
                {coverPhotos.length > 0 ? (
                    <div className="h-full w-full relative overflow-hidden">
                        <img
                            src={coverPhotos[activePhoto]}
                            alt={`Photo ${activePhoto + 1}`}
                            className="h-full w-full object-cover transition-all duration-500 cursor-zoom-in"
                            onClick={() => {
                                const picIndex = allGalleryPhotos.indexOf(coverPhotos[activePhoto]);
                                openGallery(picIndex >= 0 ? picIndex : 0);
                            }}
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Dots for carousel */}
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
                            {coverPhotos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePhoto(i)}
                                    className={`h-1.5 rounded-full transition-all ${i === activePhoto ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                                />
                            ))}
                        </div>

                        {/* Arrows for carousel */}
                        {coverPhotos.length > 1 && (
                            <>
                                <button 
                                    onClick={() => setActivePhoto((prev) => (prev > 0 ? prev - 1 : coverPhotos.length - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6 rotate-180" />
                                </button>
                                <button 
                                    onClick={() => setActivePhoto((prev) => (prev < coverPhotos.length - 1 ? prev + 1 : 0))}
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
            <div className="mx-auto -mt-16 max-w-4xl px-4 relative z-10">
                <div className="rounded-3xl border border-border bg-card p-5 shadow-xl md:p-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
                            <div className="relative">
                                <img
                                    src={displayPic}
                                    alt="Profile"
                                    className="h-28 w-28 rounded-3xl border-4 border-card object-cover shadow-lg md:h-40 md:w-40 ring-1 ring-black/5 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => {
                                        const picIndex = allGalleryPhotos.indexOf(displayPic);
                                        openGallery(picIndex >= 0 ? picIndex : 0);
                                    }}
                                />
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5 border-4 border-card">
                                    <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                                </div>
                            </div>
                            <div className="pb-1">
                                <h1 className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
                                    {userName}<span className="text-rose-500">.</span>
                                </h1>
                                <p className="flex items-center justify-center md:justify-start gap-1 text-muted-foreground font-medium mt-1 text-sm md:text-base">
                                    <MapPin className="h-4 w-4" />
                                    {location}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {isOwnProfile ? (
                                <>
                                    <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold w-full sm:w-auto order-2 sm:order-1" onClick={handleShare}>
                                        <Share2 className="mr-2 h-4 w-4" /> Partager
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold w-full sm:w-auto order-3 sm:order-2" asChild>
                                        <Link to="/settings">
                                            <Edit className="mr-2 h-4 w-4" /> Modifier
                                        </Link>
                                    </Button>
                                    <Button size="lg" className="rounded-xl font-bold shadow-lg shadow-primary/20 w-full sm:w-auto order-1 sm:order-3" asChild>
                                        <Link to="/settings">
                                            <Settings className="mr-2 h-5 w-5 sm:mr-0" />
                                            <span className="sm:hidden">Paramètres</span>
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="lg" className="rounded-xl font-bold bg-primary w-full sm:w-auto" onClick={handleLike}>
                                        <Heart className="mr-2 h-5 w-5 fill-current" /> J'aime
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-xl border-2 font-bold w-full sm:w-auto" onClick={() => navigate(`/messages?user=${id}`, {
                                        state: {
                                            userName,
                                            userPhoto: displayPic,
                                            userLocation: location
                                        }
                                    })}>
                                        <MessageCircle className="mr-2 h-5 w-5" /> Message
                                    </Button>
                                    <div className="flex gap-2 w-full sm:w-auto justify-center">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-rose-500 rounded-xl h-12 w-12 border border-border sm:border-0" onClick={handleBlock} title="Bloquer">
                                            <UserX className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-amber-500 rounded-xl h-12 w-12 border border-border sm:border-0" onClick={handleReport} title="Signaler">
                                            <ShieldAlert className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-lg font-bold text-foreground mb-3">À propos de {isOwnProfile ? 'moi' : userName}</h2>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    {userBio}
                                </p>
                            </div>

                            {!isOwnProfile && (
                                <div>
                                    <h2 className="text-lg font-bold text-foreground mb-3">Infos Rapides</h2>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Âge</p>
                                            <p className="text-base font-bold text-foreground">{publicUser?.age} ans</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Genre</p>
                                            <p className="text-base font-bold text-foreground capitalize">{publicUser?.gender === 'man' ? 'Homme' : 'Femme'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isOwnProfile && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold text-foreground mb-3">Infos Rapides</h2>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Âge</p>
                                            <p className="text-base font-bold text-foreground">{prefs?.age || 25} ans</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Genre</p>
                                            <p className="text-base font-bold text-foreground capitalize">{prefs?.gender === 'man' ? 'Homme' : 'Femme'}</p>
                                        </div>
                                        <div className="rounded-2xl bg-muted/50 p-4 border border-border/50 xs:col-span-2 sm:col-span-1 text-center sm:text-left">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Forfait</p>
                                            <p className="text-base font-bold text-foreground">{getPlanName()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isOwnProfile && (
                                <div>
                                    <h2 className="text-lg font-bold text-foreground mb-3">Mes Préférences</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { label: "Je suis", value: (prefs?.gender === 'man' ? 'Homme' : (prefs?.gender === 'woman' ? 'Femme' : 'Non spécifié')) },
                                            { label: "Recherche", value: (prefs?.lookingFor === 'man' ? 'Homme' : (prefs?.lookingFor === 'woman' ? 'Femme' : 'Non spécifié')) },
                                            { label: "Tranche d'âge", value: prefs?.ageRange || "Non spécifié" },
                                            { label: "Lieu", value: prefs?.location || "Non spécifié" },
                                        ].map((attr, i) => (
                                            <div key={i} className="flex items-center justify-between rounded-2xl bg-muted/50 p-4 border border-border/50 text-sm">
                                                <span className="font-medium text-muted-foreground uppercase tracking-wider text-[10px]">{attr.label}</span>
                                                <span className="font-bold text-foreground capitalize">{attr.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-primary/20 p-2.5 mt-0.5">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-base mb-1">Restez en Sécurité</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">Suivez nos conseils et donnez la priorité à votre sécurité avec de nouvelles personnes.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Info Grid */}
                            <div>
                                <h2 className="text-lg font-bold text-foreground mb-5">Détails Personnels</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { label: "Loisirs", value: (isOwnProfile ? prefs?.hobbies : publicUser?.hobbies), icon: Heart, placeholder: "Ajouter" },
                                        { label: "Activités", value: (isOwnProfile ? prefs?.favoriteActivities : publicUser?.favoriteActivities), icon: Activity, placeholder: "Ajouter" },
                                        { label: "Zodiaque", value: (isOwnProfile ? prefs?.zodiacSign : publicUser?.zodiacSign), icon: Moon, placeholder: "Signe" },
                                        { label: "Religion", value: (isOwnProfile ? prefs?.religion : publicUser?.religion), icon: Sparkles, placeholder: "Ajouter" },
                                        { label: "Enfants", value: (isOwnProfile ? (prefs?.children === 'none' ? 'Aucun' : (prefs?.children === 'want' ? 'En veut' : (prefs?.children === 'have' ? 'En a' : (prefs?.children === 'dont_want' ? "N'en veut pas" : prefs?.children)))) : (publicUser?.children === 'none' ? 'Aucun' : (publicUser?.children === 'want' ? 'En veut' : (publicUser?.children === 'have' ? 'En a' : (publicUser?.children === 'dont_want' ? "N'en veut pas" : publicUser?.children))))), icon: Baby, placeholder: "Préférence" },
                                        { label: "Taille", value: (isOwnProfile ? (prefs?.height ? `${prefs.height} cm` : null) : (publicUser?.height ? `${publicUser.height} cm` : null)), icon: Ruler, placeholder: "Ajouter" },
                                        { label: "Yeux", value: (isOwnProfile ? prefs?.eyeColor : publicUser?.eyeColor), icon: Eye, placeholder: "Couleur" },
                                        { label: "Cheveux", value: (isOwnProfile ? prefs?.hairColor : publicUser?.hairColor), icon: Scissors, placeholder: "Couleur" },
                                        { label: "Fumeur", value: (isOwnProfile ? (prefs?.smoke === 'yes' ? 'Oui' : (prefs?.smoke === 'no' ? 'Non' : (prefs?.smoke === 'occasionally' ? 'Parfois' : null))) : (publicUser?.smoke === 'yes' ? 'Oui' : (publicUser?.smoke === 'no' ? 'Non' : (publicUser?.smoke === 'occasionally' ? 'Parfois' : null)))), icon: Sparkles, placeholder: "Tabac" },
                                        { label: "Alcool", value: (isOwnProfile ? (prefs?.alcohol === 'never' ? 'Jamais' : (prefs?.alcohol === 'occasionally' ? 'Occasionnellement' : (prefs?.alcohol === 'regularly' ? 'Régulièrement' : null))) : (publicUser?.alcohol === 'never' ? 'Jamais' : (publicUser?.alcohol === 'occasionally' ? 'Occasionnellement' : (publicUser?.alcohol === 'regularly' ? 'Régulièrement' : null)))), icon: Wine, placeholder: "Alcool" },
                                    ].filter(item => isOwnProfile || item.value).map((item, i) => (
                                        <div key={i} 
                                            onClick={() => isOwnProfile && navigate("/settings")}
                                            className={`flex items-center gap-4 rounded-2xl p-4 border transition-all ${isOwnProfile && !item.value ? 'bg-primary/5 border-dashed border-primary/30 cursor-pointer hover:bg-primary/10' : 'bg-muted/30 border-border/40'}`}
                                        >
                                            <div className={`rounded-full p-2 ${isOwnProfile && !item.value ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                                                <p className={`font-bold text-sm truncate ${!item.value ? 'text-primary/60 italic font-medium' : 'text-foreground'}`}>
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
                                    <h3 className="font-bold text-foreground mb-4">Actions</h3>
                                    <nav className="space-y-1">
                                        {[
                                            { label: "Paramètres", icon: Settings, path: "/settings" },
                                            { label: "Conditions", icon: Shield, path: "/terms" },
                                            { label: "Déconnexion", icon: LogOut, danger: true },
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
                                                    <span className="font-medium text-sm">{item.label}</span>
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
                                            <span key={i} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                #{interest.fr}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl bg-gradient-to-br from-primary to-rose-600 p-6 text-white shadow-lg shadow-primary/20">
                                <Heart className="h-8 w-8 fill-white mb-4" />
                                <h3 className="text-lg font-bold mb-1">
                                    {isAdmin ? "Accès Admin" : (getPlanName() !== "Gratuit" ? getPlanName() : "Premium")}
                                </h3>
                                <p className="text-white/80 text-xs mb-4">
                                    {isAdmin 
                                        ? "Vous avez un accès complet à toutes les fonctionnalités."
                                        : (getPlanName() !== "Gratuit"
                                            ? `Forfait ${getPlanName()} actif.`
                                            : "Matchs illimités, voyez qui vous aime, et plus !")}
                                </p>
                                {!isAdmin && (
                                    <Button
                                        className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-11 text-sm transition-transform active:scale-[0.98]"
                                        asChild
                                    >
                                        <Link to="/plans">Voir Forfaits</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Block Confirmation Modal */}
            {showBlockConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl border border-border animate-in zoom-in-95 duration-300">
                        <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 mx-auto text-rose-500">
                            <UserX className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Bloquer {userName} ?</h3>
                        <p className="text-muted-foreground text-center mb-8">
                            Action réversible dans vos paramètres.
                        </p>
                        <div className="grid gap-3">
                            <Button variant="destructive" className="rounded-xl h-12 font-bold" onClick={confirmBlock}>
                                Bloquer
                            </Button>
                            <Button variant="ghost" className="rounded-xl h-12 font-bold" onClick={() => setShowBlockConfirm(false)}>
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-2xl border border-border animate-in zoom-in-95 duration-300">
                        <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 mx-auto text-amber-500">
                            <ShieldAlert className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Signaler</h3>
                        <p className="text-muted-foreground text-center mb-6 text-sm">
                            Veuillez expliquer brièvement pourquoi vous signalez cet utilisateur.
                        </p>
                        <textarea
                            className="w-full min-h-[100px] rounded-2xl border border-border bg-muted/30 p-4 text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all mb-6"
                            placeholder="Raison..."
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <Button variant="ghost" className="flex-1 rounded-xl h-12 font-bold" onClick={() => { setShowReportModal(false); setReportReason(""); }}>
                                Annuler
                            </Button>
                            <Button className="flex-1 rounded-xl h-12 font-bold bg-primary" onClick={submitReport}>
                                Envoyer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Modal */}
            {showGallery && (
                <div 
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
                    onClick={() => setShowGallery(false)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowGallery(false);
                        }}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    
                    <img
                        src={allGalleryPhotos[galleryIndex] || displayPic}
                        alt="Gallery"
                        className="max-h-[90vh] max-w-full object-contain rounded-lg animate-in zoom-in-95 duration-300 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    
                    {allGalleryPhotos.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryIndex((prev) => (prev > 0 ? prev - 1 : allGalleryPhotos.length - 1));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                            >
                                <ChevronRight className="h-8 w-8 rotate-180" />
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryIndex((prev) => (prev < allGalleryPhotos.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
