import { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Clock, Search, Eye, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getDefaultAvatar } from "@/lib/utils";

import { API } from "@/lib/api";

interface Stats {
    totalUsers: number;
    gender: { men: number; women: number; other: number };
    planStats: { name: string; count: number; price: number; revenue: number }[];
    totalRevenue: number;
    recentSubscribers: { id: string; name: string; email: string; planName: string; price: number; date: string }[];
}

interface UserRow {
    id: string;
    name: string;
    email: string;
    gender: string;
    age: number;
    location: string;
    photo: string;
    planName: string;
    subscriptionStatus: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Session expirée. Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            // Stats Fetch
            const fetchStats = async () => {
                try {
                    const res = await fetch(`${API}/admin/stats`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    const data = await res.json();
                    if (data.success) {
                        setStats(data.stats);
                    } else {
                        console.error("Stats API Error:", data);
                        toast.error(data.message || "Erreur statistiques");
                    }
                } catch (err) {
                    console.error("Stats Fetch Error:", err);
                    toast.error("Impossible de charger les statistiques.");
                }
            };

            // Users Fetch
            const fetchUsers = async () => {
                try {
                    const res = await fetch(`${API}/admin/users`, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    
                    const text = await res.text();
                    try {
                        const data = JSON.parse(text);
                        if (data.success) {
                            setUsers(data.users);
                        } else {
                            console.error("Users API Error:", data);
                            toast.error(data.message || "Erreur utilisateurs");
                        }
                    } catch (parseErr) {
                        console.error("Backend non déployé - HTML reçu");
                        toast.error("Veuillez uploader adminController.js et adminRoutes.js sur votre serveur ! (Le code backend n'est pas à jour)", { duration: 10000 });
                    }
                } catch (err) {
                    console.error("Users Fetch Error:", err);
                    toast.error("Impossible de charger la liste des utilisateurs.");
                }
            };

            await Promise.all([fetchStats(), fetchUsers()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!stats) return <div className="text-center py-20">No data available.</div>;

    const cards = [
        { label: "Total Utilisateurs", value: stats.totalUsers, icon: Users, color: "bg-blue-500", trend: "+12%", up: true },
        { label: "Revenu Total", value: `€${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "bg-green-500", trend: "+8.5%", up: true },
        { label: "Abonnés Actifs", value: stats.planStats.reduce((a, b) => a + (b.price > 0 ? b.count : 0), 0), icon: TrendingUp, color: "bg-purple-500", trend: "+5%", up: true },
        { label: "Hommes (Men)", value: stats.gender.men, icon: Users, color: "bg-indigo-500", trend: stats.totalUsers > 0 ? `${Math.round((stats.gender.men / stats.totalUsers) * 100)}%` : "0%", up: null },
        { label: "Femmes (Women)", value: stats.gender.women, icon: Users, color: "bg-rose-500", trend: stats.totalUsers > 0 ? `${Math.round((stats.gender.women / stats.totalUsers) * 100)}%` : "0%", up: null },
    ];

    return (
        <div className="min-h-screen bg-muted/30 pb-20 pt-8 md:pt-24 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                        Tableau de Bord Admin<span className="text-primary">.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Aperçu global de votre plateforme.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
                    {cards.map((card, i) => (
                        <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${card.color} text-white`}>
                                    <card.icon className="h-6 w-6" />
                                </div>
                                {card.trend && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${card.up === true ? 'bg-green-100 text-green-700' : (card.up === false ? 'bg-rose-100 text-rose-700' : 'bg-muted text-muted-foreground')}`}>
                                        {card.up === true && <ArrowUpRight className="h-3 w-3" />}
                                        {card.up === false && <ArrowDownRight className="h-3 w-3" />}
                                        {card.trend}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-muted-foreground text-sm font-medium mb-1">{card.label}</h3>
                            <p className="text-2xl font-black text-foreground">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* User Distribution by Plan */}
                    <div className="lg:col-span-1 rounded-3xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg">Distribution des Plans</h2>
                            <PieChart className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-4">
                            {stats.planStats.map((plan, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="font-medium text-foreground">{plan.name}</span>
                                        <span className="text-muted-foreground font-bold">{plan.count} ({stats.totalUsers > 0 ? Math.round((plan.count / stats.totalUsers) * 100) : 0}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${i === 0 ? 'bg-primary' : (i === 1 ? 'bg-rose-500' : (i === 2 ? 'bg-amber-500' : 'bg-blue-500'))}`}
                                            style={{ width: `${stats.totalUsers > 0 ? (plan.count / stats.totalUsers) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gender and Revenue Split */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Transactions Table */}
                        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h2 className="font-bold text-lg">Abonnements Récents</h2>
                                <Clock className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Utilisateur</th>
                                            <th className="px-6 py-4">Plan</th>
                                            <th className="px-6 py-4">Montant</th>
                                            <th className="px-6 py-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {stats.recentSubscribers.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-foreground">{sub.name}</div>
                                                    <div className="text-xs text-muted-foreground">{sub.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase tracking-tight">
                                                        {sub.planName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-foreground">€{(sub.price ?? 0).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(sub.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {stats.recentSubscribers.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Aucun abonnement récent.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Users Section */}
                <div className="mt-12 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-2xl font-black text-foreground">Tous les Utilisateurs<span className="text-primary font-black">.</span></h2>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input 
                                type="text"
                                placeholder="Rechercher par nom, email ou lieu..."
                                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm text-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Infos/Âge</th>
                                        <th className="px-6 py-4">Localisation</th>
                                        <th className="px-6 py-4">Plan / Statut</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-2 ring-primary/20">
                                                        <img 
                                                            src={user.photo || getDefaultAvatar(user.gender)} 
                                                            alt={user.name} 
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground">{user.name}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Inscrit le {new Date(user.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-foreground font-medium">{user.email}</div>
                                                <div className="text-xs text-muted-foreground capitalize">{user.gender === 'man' ? 'Homme' : 'Femme'}, {user.age} ans</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span className="font-medium">{user.location || "Non spécifié"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-tight block w-fit">
                                                        {user.planName}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${user.subscriptionStatus === 'active' ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                        {user.subscriptionStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link 
                                                    to={`/profile/${user.id}`}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-muted text-foreground hover:bg-primary hover:text-white transition-all font-bold text-xs"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Voir Profile
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                                Aucun utilisateur trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
