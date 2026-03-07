export default function StatsSection() {
    const stats = [
        { label: "Active Users", value: "5M+" },
        { label: "Matches Made", value: "1.2M+" },
        { label: "Success Stories", value: "500K+" },
        { label: "Countries", value: "50+" },
    ];

    return (
        <section className="bg-primary py-16 text-primary-foreground">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-2 text-4xl font-extrabold sm:text-5xl">{stat.value}</div>
                            <div className="text-sm font-medium uppercase tracking-wider opacity-80">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
