import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft, Star, Zap, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const API = "/api";
const PAYPAL_CLIENT_ID = "AfUE0E35GfN__bPrGA5C5kXFefBHtu2dVJJL_UK-xqf8q70YPYnjTIV6Cc84WyIdPOid_xjyUSOpUvA4";

interface Plan {
    _id: string;
    name: string;
    price: number;
    duration: number;
    durationUnit: string;
    features: string[];
    priority: number;
}

export default function SubscriptionPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [selectedPlanForPaypal, setSelectedPlanForPaypal] = useState<Plan | null>(null);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetch(`${API}/plans`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPlans(data.plans);
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
                toast.success(`Abonnement ${data.user.plan.name} activé ! 🎉`);
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
        localStorage.setItem("user", JSON.stringify({
            ...currentUser,
            plan: userData.plan._id || userData.plan,
            planName: userData.plan.name || userData.planName,
            subscriptionStatus: userData.subscriptionStatus,
            subscriptionExpiry: userData.subscriptionExpiry
        }));
    };

    const createOrder = async (data: any, actions: any) => {
        if (!selectedPlanForPaypal) return "";

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/paypal/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ planId: selectedPlanForPaypal._id })
            });

            const orderData = await res.json();

            if (!orderData.success || !orderData.id) {
                console.error("PayPal Order Creation Failed:", orderData);
                toast.error(orderData.message || "Erreur lors de la création de la commande PayPal.");
                throw new Error(orderData.message || "Order creation failed");
            }

            return orderData.id;
        } catch (err: any) {
            console.error("createOrder error:", err);
            if (!err.message?.includes("Order creation failed")) {
                toast.error("Erreur réseau lors de la création de la commande PayPal.");
            }
            throw err;
        }
    };

    const onApprove = async (data: any, actions: any) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/paypal/capture-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
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
            console.error(err);
            toast.error("Erreur lors du traitement du paiement.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const icons = [<Shield className="h-6 w-6" />, <Zap className="h-6 w-6" />, <Star className="h-6 w-6" />, <Heart className="h-6 w-6" />];

    return (
        <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "EUR", intent: "capture" }}>
            <div className="min-h-screen bg-muted/30 pb-20 pt-8 md:pt-24">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-10 flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                                Choisissez votre Forfait<span className="text-primary">.</span>
                            </h1>
                            <p className="text-muted-foreground font-medium mt-1">Trouvez l'amour sans limites.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {plans.map((plan, index) => {
                            const isCurrent = currentUser.plan === plan._id || (currentUser.plan?._id === plan._id);
                            const isPopular = plan.name === 'Monthly Plan';
                            const isSelected = selectedPlanForPaypal?._id === plan._id;

                            return (
                                <div
                                    key={plan._id}
                                    className={`relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl ${isPopular ? 'ring-2 ring-primary border-primary/20 scale-105 z-10' : ''}`}
                                >
                                    {isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white uppercase tracking-widest">
                                            Plus Populaire
                                        </div>
                                    )}

                                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${isPopular ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                        {icons[index % icons.length]}
                                    </div>

                                    <h3 className="mb-1 text-xl font-bold text-foreground">{plan.name}</h3>
                                    <div className="mb-6 flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-foreground">€{plan.price.toFixed(2)}</span>
                                        <span className="text-sm font-medium text-muted-foreground lowercase">
                                            {plan.duration > 1 ? `/ ${plan.duration} ${plan.durationUnit}s` : `/ ${plan.durationUnit}`}
                                        </span>
                                    </div>

                                    <ul className="mb-8 flex-1 space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <div className="mt-0.5 rounded-full bg-green-500/10 p-0.5">
                                                    <Check className="h-3 w-3 text-green-600" />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {plan.price === 0 ? (
                                        <Button
                                            onClick={() => handleFreeSubscribe(plan._id)}
                                            disabled={submitting !== null || isCurrent}
                                            className="w-full rounded-xl py-6 font-bold"
                                            variant={isCurrent ? "outline" : "ghost"}
                                        >
                                            {isCurrent ? "Plan Actuel" : "Inclus"}
                                        </Button>
                                    ) : isCurrent ? (
                                        <Button disabled variant="outline" className="w-full rounded-xl py-6 font-bold">
                                            Plan Actuel
                                        </Button>
                                    ) : (
                                        <div className="space-y-3">
                                            {!isSelected ? (
                                                <Button
                                                    onClick={() => setSelectedPlanForPaypal(plan)}
                                                    className={`w-full rounded-xl py-6 font-bold transition-all ${isPopular ? 'shadow-lg shadow-primary/30' : ''}`}
                                                >
                                                    Sélectionner
                                                </Button>
                                            ) : (
                                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <PayPalButtons
                                                        style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onCancel={() => setSelectedPlanForPaypal(null)}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full mt-2 text-xs"
                                                        onClick={() => setSelectedPlanForPaypal(null)}
                                                    >
                                                        Annuler
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
