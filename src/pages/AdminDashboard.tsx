import { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { toast } from "sonner";

const API = "https://datting-backend.vercel.app/api";


interface Stats {
    totalUsers: number;
    gender: { men: number; women: number; other: number };
    planStats: { name: string; count: number; price: number; revenue: number }[];
    totalRevenue: number;
    recentSubscribers: { id: string; name: string; email: string; planName: string; price: number; date: string }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error("Erreur lors du chargement des statistiques.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
        { label: "Hommes (Men)", value: stats.gender.men, icon: Users, color: "bg-indigo-500", trend: `${Math.round((stats.gender.men / stats.totalUsers) * 100)}%`, up: null },
        { label: "Femmes (Women)", value: stats.gender.women, icon: Users, color: "bg-rose-500", trend: `${Math.round((stats.gender.women / stats.totalUsers) * 100)}%`, up: null },
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
                                        <span className="text-muted-foreground font-bold">{plan.count} ({Math.round((plan.count / stats.totalUsers) * 100)}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${i === 0 ? 'bg-primary' : (i === 1 ? 'bg-rose-500' : (i === 2 ? 'bg-amber-500' : 'bg-blue-500'))}`}
                                            style={{ width: `${(plan.count / stats.totalUsers) * 100}%` }}
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
                                                <td className="px-6 py-4 font-bold text-foreground">€{sub.price.toFixed(2)}</td>
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
            </div>
        </div>
    );
}
