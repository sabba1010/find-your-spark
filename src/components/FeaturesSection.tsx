import { MessageCircle, Heart, Search, Video } from "lucide-react";

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Smart Matching",
    description: "Our advanced algorithm connects you with people who share your interests and values.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Real-time Messaging",
    description: "Start a conversation instantly with our seamless and secure chat platform.",
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Video Dates",
    description: "Connect face-to-face from the comfort of your home with high-quality video calling.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Verified Profiles",
    description: "Browse with confidence knowing that our team manually verifies every profile.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose Find Your Spark?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We provide the tools and security you need to find a meaningful connection in the modern dating world.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-md"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
