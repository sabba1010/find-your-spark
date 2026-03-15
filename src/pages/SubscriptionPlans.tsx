import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Star, Zap, Shield, Heart, Crown } from "lucide-react";
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

const TIER_ORDER = ["Free", "Weekly", "Monthly", "6-Month"];
const TIER_ICONS: Record<string, any> = {
    Free: <Heart className="h-6 w-6" />,
    Weekly: <Shield className="h-6 w-6" />,
    Monthly: <Star className="h-6 w-6" />,
    "6-Month": <Crown className="h-6 w-6" />
};
const TIER_COLORS: Record<string, string> = {
    Free: "bg-gray-100 text-gray-700 ring-gray-200",
    Weekly: "bg-green-100 text-green-700 ring-green-200",
    Monthly: "bg-purple-100 text-purple-700 ring-purple-500/20 shadow-purple-500/10 z-10 scale-[1.02]",
    "6-Month": "bg-blue-100 text-blue-700 ring-blue-500/30 shadow-blue-500/20 z-10 scale-[1.02]"
};
const TIER_BADGES: Record<string, string> = {
    Monthly: "Plus Populaire",
    "6-Month": "Meilleure Valeur"
};

export default function SubscriptionPlans() {
    const [groupedPlans, setGroupedPlans] = useState<Record<string, Plan[]>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({});
    const [selectedPlanForPaypal, setSelectedPlanForPaypal] = useState<Plan | null>(null);
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
                    
                    // Sort durations ascending (1 month, 6 month)
                    Object.values(groups).forEach(tierPlans => {
                        tierPlans.sort((a, b) => a.duration - b.duration);
                    });

                    // Set default duration to 1 for all tiers if not specified
                    const defaultDurations: Record<string, number> = {};
                    Object.keys(groups).forEach(tier => {
                        if (groups[tier].length > 0) {
                            defaultDurations[tier] = groups[tier][0].duration;
                        }
                    });

                    setGroupedPlans(groups);
                    setSelectedDurations(defaultDurations);
                }
            })
            .catch(err => console.error("Error fetching plans:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleFreeSubscribe = async (planId: string) => {
        setSubmitting(planId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/plans/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ planId })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Abonnement ${data.user.plan?.name || "Gratuit"} activé ! 🎉`);
                updateUserLocal(data.user);
                setTimeout(() => navigate("/profile"), 1500);
            } else {
                toast.error(data.message || "Erreur lors de l'abonnement.");
            }
        } catch (err) {
            toast.error("Erreur serveur lors de l'abonnement.");
        } finally {
            setSubmitting(null);
        }
    };

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

    const createOrder = async (data: any, actions: any) => {
        if (!selectedPlanForPaypal) return "";
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/paypal/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ planId: selectedPlanForPaypal._id })
            });
            const orderData = await res.json();
            if (!orderData.success || !orderData.id) throw new Error(orderData.message || "Order creation failed");
            return orderData.id;
        } catch (err: any) {
            toast.error("Erreur réseau lors de la création de la commande PayPal.");
            throw err;
        }
    };

    const onApprove = async (data: any, actions: any) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ orderId: data.orderID, planId: selectedPlanForPaypal?._id })
            });
            const captureData = await res.json();
            if (captureData.success) {
                toast.success(captureData.message);
                updateUserLocal(captureData.user);
                setTimeout(() => navigate("/profile"), 1500);
            } else {
                toast.error(captureData.message || "Erreur lors de la capture du paiement.");
            }
        } catch (err) {
            toast.error("Erreur lors du traitement du paiement.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/30">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const availableTiers = TIER_ORDER.filter(tier => groupedPlans[tier] && groupedPlans[tier].length > 0);

    return (
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR", intent: "capture" }}>
            <div className="min-h-screen bg-muted/30 pb-20 pt-16 md:pt-32 cursor-default">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-12 flex flex-col items-center text-center">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="absolute left-4 top-20 rounded-full md:left-8">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            Passez à la <span className="text-primary">vitesse supérieure.</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-3 text-lg max-w-2xl">
                            Débloquez des fonctionnalités exclusives et trouvez l'amour plus rapidement avec nos formules Premium.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch px-2 pb-10">
                        {availableTiers.map(tier => {
                            const tierPlans = groupedPlans[tier];
                            const currentDuration = selectedDurations[tier] || tierPlans[0].duration;
                            const activePlan = tierPlans.find(p => p.duration === currentDuration) || tierPlans[0];
                            
                            const isCurrent = currentUser.plan === activePlan._id || currentUser.plan?._id === activePlan._id;
                            const isCurrentTier = currentUser.plan?.tier === tier || (!currentUser.plan?.tier && tier === 'Free');
                            const isSelected = selectedPlanForPaypal?._id === activePlan._id;
                            const badge = TIER_BADGES[tier];
                            const isHighlighted = tier === 'Premium' || tier === 'Prestige';
                            const monthlyPrice = activePlan.duration > 1 ? (activePlan.price / activePlan.duration).toFixed(2) : activePlan.price.toFixed(2);

                            return (
                                <div
                                    key={tier}
                                    className={`relative flex flex-col rounded-3xl border bg-card p-6 pb-8 transition-all duration-300 ${isHighlighted ? 'border-primary/20 shadow-xl z-10' : 'border-border shadow-sm hover:shadow-md'} ${TIER_COLORS[tier]?.split(' ')[2] || ''}`}
                                >
                                    {badge && (
                                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md ${tier === 'Prestige' ? 'bg-blue-600' : 'bg-primary'}`}>
                                            {badge}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TIER_COLORS[tier]?.split(' ').slice(0,2).join(' ') || 'bg-primary/10 text-primary'}`}>
                                            {TIER_ICONS[tier]}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground capitalize tracking-tight">{tier}</h3>
                                    </div>

                                    {/* Pricing Display */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-foreground">
                                                €{monthlyPrice}
                                            </span>
                                            <span className="text-sm font-medium text-muted-foreground">/ mois</span>
                                        </div>
                                        {activePlan.duration > 1 && (
                                            <div className="text-xs font-medium text-muted-foreground mt-1">
                                                Facturé €{activePlan.price.toFixed(2)} tous les {activePlan.duration} {activePlan.durationUnit}s
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration Toggles if multiple options exist */}
                                    {tierPlans.length > 1 && (
                                        <div className="flex justify-center mb-6 mt-auto">
                                            <div className="flex rounded-lg bg-muted p-1 border shadow-inner">
                                                {tierPlans.map(p => (
                                                    <button
                                                        key={p._id}
                                                        onClick={() => setSelectedDurations(prev => ({ ...prev, [tier]: p.duration }))}
                                                        className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md whitespace-nowrap ${currentDuration === p.duration ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                    >
                                                        {p.duration} Mois
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="my-6 border-b border-border" />

                                    {/* Features List */}
                                    <ul className="mb-8 flex-1 space-y-3">
                                        {activePlan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                                                <div className={`mt-0.5 rounded-full p-0.5 ${tier === 'Free' ? 'bg-gray-200' : 'bg-green-500/10'}`}>
                                                    <Check className={`h-3 w-3 ${tier === 'Free' ? 'text-gray-500' : 'text-green-600'}`} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Action Buttons */}
                                    <div className="mt-auto">
                                        {activePlan.price === 0 ? (
                                            <Button
                                                onClick={() => handleFreeSubscribe(activePlan._id)}
                                                disabled={submitting !== null || isCurrentTier}
                                                className="w-full rounded-xl py-6 font-bold"
                                                variant={isCurrentTier ? "outline" : "secondary"}
                                            >
                                                {isCurrentTier ? "Votre Forfait" : "Passer à Gratuit"}
                                            </Button>
                                        ) : isCurrentTier ? (
                                            isCurrent ? (
                                                <Button disabled variant="outline" className="w-full rounded-xl py-6 font-bold border-primary text-primary bg-primary/5">
                                                    Forfait Actuel
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => setSelectedPlanForPaypal(activePlan)}
                                                    variant="secondary"
                                                    className="w-full rounded-xl py-6 font-bold"
                                                >
                                                    Changer la durée
                                                </Button>
                                            )
                                        ) : (
                                            <div className="space-y-3">
                                                {!isSelected ? (
                                                    <Button
                                                        onClick={() => setSelectedPlanForPaypal(activePlan)}
                                                        className={`w-full rounded-xl py-6 font-bold transition-all ${isHighlighted ? 'shadow-lg shadow-primary/20' : ''} ${tier === 'Prestige' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                                                    >
                                                        Choisir {tier}
                                                    </Button>
                                                ) : (
                                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-background rounded-xl p-2 shadow-inner border border-primary/20 mt-4">
                                                        <PayPalButtons
                                                            style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onCancel={() => setSelectedPlanForPaypal(null)}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                                                            onClick={() => setSelectedPlanForPaypal(null)}
                                                        >
                                                            Annuler
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
