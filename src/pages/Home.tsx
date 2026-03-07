import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProfileCard from "@/components/ProfileCard";
import { fakeUsers } from "@/data/users";

export default function Home() {
  const featured = fakeUsers.slice(0, 3);

  return (
    <div className="pb-20 md:pt-16">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="relative z-10 text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-primary-foreground opacity-90" />
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Find your perfect match
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
            Connect with real people near you. Start your love story today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-primary-foreground border-primary-foreground/30 border hover:bg-primary-foreground/10" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Featured Profiles</h2>
          <Link to="/discover" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>
      </section>
    </div>
  );
}
