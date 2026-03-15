import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Star, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { API } from "@/lib/api";

const PAYPAL_CLIENT_ID = "AfUE0E35GfN__bPrGA5C5kXFefBHtu2dVJJL_UK-xqf8q70YPYnjTIV6Cc84WyIdPOid_xjyUSOpUvA4";

interface Plan {
    _id: string;
    name: string;
    tier: string;
    price: number;
    duration: number;
    durationUnit: string;
    features: string[];
    priority: number;
}

const TIERS = ["Essential", "Premium", "Prestige"];

const TIER_CONFIG: Record<string, { icon: any; tabColor: string; badgeColor: string; buttonClass: string; badge: string; tagline: string }> = {
    Essential: {
        icon: <Shield className="h-5 w-5" />,
        tabColor: "bg-green-500 text-white",
        badgeColor: "bg-green-500",
        buttonClass: "bg-green-500 hover:bg-green-600 text-white",
        badge: "",
        tagline: "The essentials to get started with peace of mind"
    },
    Premium: {
        icon: <Star className="h-5 w-5" />,
        tabColor: "bg-pink-500 text-white",
        badgeColor: "bg-pink-500",
        buttonClass: "bg-pink-500 hover:bg-pink-600 text-white",
        badge: "Recommandé",
        tagline: "Multiply your contacts, upgrade to the Premium experience"
    },
    Prestige: {
        icon: <Crown className="h-5 w-5" />,
        tabColor: "bg-slate-800 text-white",
        badgeColor: "bg-slate-800",
        buttonClass: "bg-slate-800 hover:bg-slate-900 text-white",
        badge: "VIP",
        tagline: "Enjoy the best with Prestige"
    }
};

const ALL_FEATURES = [
    "Explore unlimited profiles",
    "Go back to previous profiles",
    "See who liked your profile",
    "Read all your received messages",
    "Browse ad-free",
    "Send unlimited messages",
    "See who viewed your profile",
    "Unlock advanced search filters",
    "View all profiles in your search",
    "Send 3 Super Likes per week",
    "See when your messages are read",
    "Send 6 Super Likes per week"
];

const TIER_FEATURES: Record<string, string[]> = {
    Essential: [
        "Explore unlimited profiles",
        "Go back to previous profiles",
        "See who liked your profile",
        "Read all your received messages",
        "Browse ad-free"
    ],
    Premium: [
        "Explore unlimited profiles",
        "Go back to previous profiles",
        "See who liked your profile",
        "Read all your received messages",
        "Browse ad-free",
        "Send unlimited messages",
        "See who viewed your profile",
        "Unlock advanced search filters",
        "View all profiles in your search",
        "Send 3 Super Likes per week",
        "See when your messages are read"
    ],
    Prestige: [
        "Explore unlimited profiles",
        "Go back to previous profiles",
        "See who liked your profile",
        "Read all your received messages",
        "Browse ad-free",
        "Send unlimited messages",
        "See who viewed your profile",
        "Unlock advanced search filters",
        "View all profiles in your search",
        "Send 3 Super Likes per week",
        "See when your messages are read",
        "Send 6 Super Likes per week"
    ]
};

const DURATION_LABEL: Record<string, string> = {
    "1-week": "1 week",
    "1-month": "1 month",
    "6-month": "6 months"
};

export default function SubscriptionPlans() {
    const [groupedPlans, setGroupedPlans] = useState<Record<string, Plan[]>>({});
    const [loading, setLoading] = useState(true);
    const [activeTier, setActiveTier] = useState("Essential");
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [showPaypal, setShowPaypal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetch(`${API}/plans`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.plans) {
                    const groups: Record<string, Plan[]> = {};
                    data.plans.forEach((p: Plan) => {
                        if (!groups[p.tier]) groups[p.tier] = [];
                        groups[p.tier].push(p);
                    });
                    Object.values(groups).forEach(tierPlans => {
                        tierPlans.sort((a, b) => b.duration - a.duration); // 6 month first
                    });
                    setGroupedPlans(groups);
                    // Default selection: recommended plan for each tier
                    const defaultPlan = groups["Essential"]?.find(p => p.duration === 1 && p.durationUnit === "month") || groups["Essential"]?.[0];
                    setSelectedPlan(defaultPlan || null);
                }
            })
            .catch(() => toast.error("Erreur lors du chargement des plans."))
            .finally(() => setLoading(false));
    }, []);

    // Update selected plan when tier changes
    useEffect(() => {
        const tierPlans = groupedPlans[activeTier];
        if (tierPlans && tierPlans.length > 0) {
            const rec = tierPlans.find(p => p.duration === 1 && p.durationUnit === "month") || tierPlans[0];
            setSelectedPlan(rec);
            setShowPaypal(false);
        }
    }, [activeTier, groupedPlans]);

    const updateUserLocal = (userData: any) => {
        const freshUser = JSON.parse(localStorage.getItem("user") || "{}");
        const planObj = userData.plan && typeof userData.plan === 'object' ? userData.plan : freshUser.plan;
        localStorage.setItem("user", JSON.stringify({
            ...freshUser,
            plan: planObj,
            planName: planObj?.name || userData.planName || freshUser.planName,
            subscriptionStatus: userData.subscriptionStatus || freshUser.subscriptionStatus,
            subscriptionExpiry: userData.subscriptionExpiry || freshUser.subscriptionExpiry
        }));
    };

    const handleSubscribe = async () => {
        if (!selectedPlan) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/plans/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ planId: selectedPlan._id })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Abonnement activé ! 🎉`);
                updateUserLocal(data.user);
                setTimeout(() => navigate("/profile"), 1500);
            } else {
                toast.error(data.message || "Erreur lors de l'abonnement.");
            }
        } catch {
            toast.error("Erreur serveur.");
        } finally {
            setSubmitting(false);
        }
    };

    const createOrder = async (_data: any, _actions: any) => {
        if (!selectedPlan) return "";
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/paypal/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ planId: selectedPlan._id })
        });
        const orderData = await res.json();
        if (!orderData.success || !orderData.id) throw new Error(orderData.message);
        return orderData.id;
    };

    const onApprove = async (data: any, _actions: any) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/paypal/capture-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ orderId: data.orderID, planId: selectedPlan?._id })
        });
        const captureData = await res.json();
        if (captureData.success) {
            toast.success(captureData.message);
            updateUserLocal(captureData.user);
            setTimeout(() => navigate("/profile"), 1500);
        } else {
            toast.error(captureData.message || "Erreur lors du paiement.");
        }
    };

    const formatDurationLabel = (p: Plan) => {
        if (p.durationUnit === "week") return `1 week`;
        if (p.duration === 6) return `6 months`;
        return `1 month`;
    };

    const monthlyPrice = (p: Plan) => {
        if (p.durationUnit === "week") return p.price.toFixed(2);
        if (p.duration === 6) return (p.price / 6).toFixed(2);
        return p.price.toFixed(2);
    };

    const savings = (p: Plan, plans: Plan[]) => {
        const monthly = plans.find(x => x.duration === 1 && x.durationUnit === "month");
        if (!monthly || p._id === monthly._id) return null;
        if (p.durationUnit === "week") return null;
        const saved = Math.round((1 - (p.price / 6) / monthly.price) * 100);
        return saved > 0 ? saved : null;
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const tierPlans = groupedPlans[activeTier] || [];
    const cfg = TIER_CONFIG[activeTier];

    return (
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR", intent: "capture" }}>
            <div className="min-h-screen bg-gray-50 pb-20 pt-16 md:pt-24">
                <div className="mx-auto max-w-6xl px-4">
                    {/* Back button */}
                    <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </button>

                    {/* Tier Tabs */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex gap-0 rounded-full bg-gray-200 p-1">
                            {TIERS.filter(t => groupedPlans[t]).map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setActiveTier(tier)}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTier === tier ? TIER_CONFIG[tier].tabColor : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {tier}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tagline */}
                    <div className="text-center mb-8">
                        <p className="text-2xl font-bold text-gray-800 max-w-md mx-auto">{cfg.tagline}</p>
                        <p className="text-gray-500 mt-2 font-medium">Choose a subscription</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                        {/* Left: Duration Cards */}
                        <div className="w-full lg:w-80 flex flex-col gap-3">
                            {tierPlans.map(plan => {
                                const isSelected = selectedPlan?._id === plan._id;
                                const rec = plan.duration === 1 && plan.durationUnit === "month";
                                const best = plan.duration === 6;
                                const saved = savings(plan, tierPlans);

                                return (
                                    <button
                                        key={plan._id}
                                        onClick={() => { setSelectedPlan(plan); setShowPaypal(false); }}
                                        className={`relative w-full text-left rounded-2xl border-2 px-5 py-4 transition-all ${isSelected ? 'border-gray-800 bg-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                                    >
                                        {best && (
                                            <span className="absolute -top-3 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                                                Best Price
                                            </span>
                                        )}
                                        {rec && (
                                            <span className={`absolute -top-3 left-4 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wide ${cfg.badgeColor}`}>
                                                Recommended
                                            </span>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">{formatDurationLabel(plan)}</span>
                                            <div className="text-right">
                                                <div className="text-base font-bold text-gray-900">€{monthlyPrice(plan)}/{plan.durationUnit === "week" ? "week" : "month"}*</div>
                                                {saved && <div className="text-xs font-semibold text-green-600">SAVE {saved}%**</div>}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center ${cfg.badgeColor}`}>
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}

                            {/* Subscribe button */}
                            {selectedPlan && !showPaypal && (
                                <Button
                                    onClick={() => setShowPaypal(true)}
                                    disabled={submitting}
                                    className={`w-full mt-2 rounded-full py-6 text-base font-bold ${cfg.buttonClass}`}
                                >
                                    Continue
                                </Button>
                            )}

                            {showPaypal && selectedPlan && (
                                <div className="mt-2 rounded-2xl bg-white border p-4 shadow">
                                    <PayPalButtons
                                        style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onCancel={() => setShowPaypal(false)}
                                    />
                                    <button onClick={() => setShowPaypal(false)} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600">
                                        Annuler
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Feature comparison table */}
                        <div className="w-full lg:max-w-md bg-white rounded-2xl border p-6 shadow-sm">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left text-sm font-medium text-gray-400 pb-4 w-1/2"></th>
                                        {TIERS.filter(t => groupedPlans[t]).map(t => (
                                            <th key={t} className="text-center pb-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs ${TIER_CONFIG[t].badgeColor}`}>
                                                        {TIER_CONFIG[t].icon}
                                                    </div>
                                                    <span className={`text-xs font-bold ${activeTier === t ? 'text-gray-900' : 'text-gray-500'}`}>{t}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ALL_FEATURES.map((feature, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className={`py-3 text-sm pr-4 ${["Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "See when your messages are read"].includes(feature) ? 'text-blue-500 font-medium' : 'text-gray-700'}`}>
                                                {feature}
                                            </td>
                                            {TIERS.filter(t => groupedPlans[t]).map(t => (
                                                <td key={t} className="text-center py-3">
                                                    {TIER_FEATURES[t]?.includes(feature) ? (
                                                        <div className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${activeTier === t ? cfg.badgeColor + ' text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                                                            <span className="text-gray-300 text-xs">–</span>
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-center text-xs text-gray-400 mt-8">
                        *Prix par mois. **Économies par rapport au tarif mensuel. Renouvellement automatique.
                    </p>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
