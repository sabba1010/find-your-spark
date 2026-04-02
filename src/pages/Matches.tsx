import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import ProfileCard from "@/components/ProfileCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, MessageSquare } from "lucide-react";

export default function Matches() {
    const [matches, setMatches] = useState<any[]>([]);
    const [likes, setLikes] = useState<any[]>([]);
    const [likesSent, setLikesSent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const planTier = currentUser.plan?.tier || 'Free';
    // Can see who liked them: Essential, Premium, Prestige
    const canSeeLikes = planTier === 'Essential' || planTier === 'Premium' || planTier === 'Prestige';
    const isFreeTier = !canSeeLikes;

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API}/users/affinities`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setMatches(data.matches || []);
                setLikes(data.likedBy || []);
                setLikesSent(data.likesSent || []);
            }
        } catch (err) {
            toast.error("Erreur de chargement.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-20 md:pt-32">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    Mes Connexions<span className="text-rose-500">.</span>
                </h1>
                <p className="mt-2 text-muted-foreground">Découvrez qui vous a aimé et vos coups de cœur réciproques.</p>
            </header>

            <Tabs defaultValue="matches" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-10 rounded-2xl p-1 bg-muted/50 border border-border/50">
                    <TabsTrigger value="matches" className="rounded-xl flex gap-2 font-bold py-3 transition-all">
                        <MessageSquare className="h-4 w-4" />
                        Matchs ({matches.length})
                    </TabsTrigger>
                    <TabsTrigger value="likes" className="rounded-xl flex gap-2 font-bold py-3 transition-all">
                        <Heart className="h-4 w-4" />
                        Reçus ({likes.length})
                    </TabsTrigger>
                    <TabsTrigger value="likesSent" className="rounded-xl flex gap-2 font-bold py-3 transition-all">
                        <Heart className="h-4 w-4 fill-current" />
                        Envoyés ({likesSent.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="matches" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {matches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border-2 border-dashed border-border p-10 bg-muted/5">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Aucun match trouvé</h2>
                            <p className="max-w-xs text-muted-foreground text-sm mb-6">
                                No matches found at the moment. Try expanding your preferences in Discover!
                            </p>
                            <a href="/discover" className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                Commencer à Découvrir
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                            {matches.map((u) => (
                                <ProfileCard key={u._id} user={{ ...u, id: u._id }} onAction={fetchData} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="likes" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {likes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-border p-12 bg-muted/10">
                            <div className="h-20 w-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                                <Heart className="h-10 w-10 text-rose-500" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Personne n'a encore liké votre profil</h2>
                            <p className="max-w-xs text-muted-foreground">Ajoutez de belles photos et une description pour attirer plus de likes !</p>
                        </div>
                    ) : isFreeTier ? (
                        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary shadow-lg border border-primary/30">
                                    <Heart className="h-8 w-8 fill-current" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-foreground">Découvrez qui vous aime</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm font-medium">
                                    {likes.length} personne{likes.length > 1 ? 's' : ''} {likes.length > 1 ? 'ont' : 'a'} déjà craqué pour vous ! Passez à l'Essentiel pour voir leurs profils et matcher instantanément.
                                </p>
                                <a href="/plans" className="rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                    Voir les Forfaits
                                </a>
                            </div>
                            
                            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 opacity-30 select-none pointer-events-none filter blur-sm">
                                {likes.slice(0, 3).map((u, idx) => (
                                    <div key={idx} className="h-72 rounded-2xl bg-muted/50 border border-border animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                            {likes.map((u) => (
                                <ProfileCard key={u._id} user={{ ...u, id: u._id }} onAction={fetchData} />
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="likesSent" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {likesSent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-border p-12 bg-muted/10">
                            <div className="h-20 w-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                                <Heart className="h-10 w-10 text-rose-500 fill-current" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Vous n'avez encore liké personne</h2>
                            <p className="max-w-xs text-muted-foreground mb-6">N'hésitez pas à faire le premier pas !</p>
                            <a href="/discover" className="rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                Découvrir des profils
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                            {likesSent.map((u) => (
                                <ProfileCard key={u._id} user={{ ...u, id: u._id }} onAction={fetchData} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
