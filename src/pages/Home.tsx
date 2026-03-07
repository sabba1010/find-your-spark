import { useState } from "react";
import { Heart, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "@/components/ProfileCard";
import { fakeUsers } from "@/data/users";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import SafetySection from "@/components/SafetySection";
import SuccessStories from "@/components/SuccessStories";
import Footer from "@/components/Footer";

const steps = ["Gender", "Looking for", "Age range", "Location", "Find matches"];

function OptionButton({ label, selected, onClick, emoji }: { label: string; selected: boolean; onClick: () => void; emoji?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-4 text-base font-medium transition-all ${selected ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-card text-foreground hover:border-primary/40"
        }`}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      {label}
      {selected && <Check className="ml-auto h-4 w-4 text-primary" />}
    </button>
  );
}

export default function Home() {
  const featured = fakeUsers.slice(0, 3);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");

  const canNext = () => {
    if (step === 0) return !!gender;
    if (step === 1) return !!lookingFor;
    if (step === 2) return !!ageRange;
    if (step === 3) return !!location;
    return true;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      localStorage.setItem("matchPrefs", JSON.stringify({ gender, lookingFor, ageRange, location }));
      navigate("/discover");
    }
  };

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

      {/* Match Setup */}
      <section className="mx-auto max-w-lg px-4 py-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">Start Matching Now</h2>
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          <p className="mb-1 text-center text-sm font-medium text-muted-foreground">Step {step + 1} of 5</p>

          {step === 0 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">I am a...</h3>
              <div className="grid gap-3">
                <OptionButton label="Man" emoji="👨" selected={gender === "man"} onClick={() => setGender("man")} />
                <OptionButton label="Woman" emoji="👩" selected={gender === "woman"} onClick={() => setGender("woman")} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">Looking for a...</h3>
              <div className="grid gap-3">
                <OptionButton label="Man" emoji="👨" selected={lookingFor === "man"} onClick={() => setLookingFor("man")} />
                <OptionButton label="Woman" emoji="👩" selected={lookingFor === "woman"} onClick={() => setLookingFor("woman")} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">Preferred age range</h3>
              <div className="grid gap-3">
                {["18–25", "25–35", "35–45", "45+"].map((range) => (
                  <OptionButton key={range} label={range} selected={ageRange === range} onClick={() => setAgeRange(range)} />
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">Your location</h3>
              <Input placeholder="e.g. Paris, London, Berlin..." value={location} onChange={(e) => setLocation(e.target.value)} className="text-center text-lg" />
            </>
          )}
          {step === 4 && (
            <div className="text-center">
              <h3 className="mb-2 text-xl font-bold text-card-foreground">You're all set! 🎉</h3>
              <p className="text-muted-foreground text-sm">We'll find the best matches based on your preferences.</p>
              <div className="mt-4 space-y-1 rounded-lg bg-muted p-4 text-sm text-left">
                <p><span className="font-medium text-foreground">Gender:</span> <span className="text-muted-foreground capitalize">{gender}</span></p>
                <p><span className="font-medium text-foreground">Looking for:</span> <span className="text-muted-foreground capitalize">{lookingFor}</span></p>
                <p><span className="font-medium text-foreground">Age range:</span> <span className="text-muted-foreground">{ageRange}</span></p>
                <p><span className="font-medium text-foreground">Location:</span> <span className="text-muted-foreground">{location}</span></p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canNext()} className="flex-1">
              {step === 4 ? <>Find Matches <Heart className="ml-1 h-4 w-4" /></> : <>Next <ArrowRight className="ml-1 h-4 w-4" /></>}
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

      {/* New Sections */}
      <FeaturesSection />
      <StatsSection />
      <SafetySection />
      <SuccessStories />

      {/* Footer */}
      <Footer />
    </div>
  );
}
