import { ShieldCheck, Lock, UserCheck } from "lucide-react";

export default function SafetySection() {
    const safetyFeatures = [
        {
            icon: <ShieldCheck className="h-10 w-10 text-primary" />,
            title: "Your Safety First",
            description: "We use advanced technology combined with human moderation to keep our community safe."
        },
        {
            icon: <Lock className="h-10 w-10 text-primary" />,
            title: "Data Privacy",
            description: "Your personal information is encrypted and never shared without your explicit consent."
        },
        {
            icon: <UserCheck className="h-10 w-10 text-primary" />,
            title: "Verified Members",
            description: "Look for the blue checkmark to know you're talking to a real person."
        }
    ];

    return (
        <section className="py-20 overflow-hidden">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Date with Confidence and Security
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            At Find Your Spark, your safety is our top priority. We've built a platform that respects your privacy and ensures a secure environment for meaningful connections.
                        </p>
                        <div className="space-y-6">
                            {safetyFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-1">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="aspect-square w-full max-w-md mx-auto rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                            <ShieldCheck className="h-48 w-48 text-primary opacity-20 absolute" />
                            <img
                                src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop"
                                alt="Safety"
                                className="relative z-10 w-4/5 h-4/5 object-cover rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
