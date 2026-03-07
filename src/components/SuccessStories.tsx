import { Quote } from "lucide-react";

const stories = [
    {
        name: "Emma & David",
        image: "https://images.unsplash.com/photo-1516589174184-c68526673fdc?q=80&w=600&auto=format&fit=crop",
        quote: "We found each other on Find Your Spark and it's been a dream come true ever since.",
        time: "Together for 2 years"
    },
    {
        name: "Sarah & Mike",
        image: "https://images.unsplash.com/photo-1522673607200-164883efbfc1?q=80&w=600&auto=format&fit=crop",
        quote: "The matching algorithm really worked for us. We shared so many interests from day one.",
        time: "Married last summer"
    },
    {
        name: "James & Lily",
        image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d3dca?q=80&w=600&auto=format&fit=crop",
        quote: "Finding someone who truly understands you is hard, but this platform made it possible.",
        time: "Engaged"
    }
];

export default function SuccessStories() {
    return (
        <section className="bg-muted/50 py-20">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Real Stories, Real Love
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Thousands of people have found their spark here. Could you be next?
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {stories.map((story, index) => (
                        <div key={index} className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-md">
                            <div className="relative h-64 overflow-hidden">
                                <img src={story.image} alt={story.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                                <div className="absolute top-4 left-4 bg-primary text-white p-2 rounded-full">
                                    <Quote className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="mb-4 text-lg italic text-foreground">"{story.quote}"</p>
                                <div>
                                    <h4 className="font-bold text-foreground">{story.name}</h4>
                                    <p className="text-sm text-muted-foreground font-medium">{story.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
