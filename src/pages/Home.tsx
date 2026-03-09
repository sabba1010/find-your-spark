import { useState } from "react";
import { Heart, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import SafetySection from "@/components/SafetySection";
import SuccessStories from "@/components/SuccessStories";
import Footer from "@/components/Footer";

const steps = ["Genre", "À la recherche de", "Tranche d'âge", "Lieu", "Trouver des profils"];

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
    <div className=" md:pt-16">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-20"
        style={{
          background: "radial-gradient(circle at 20% 30%, rgba(217, 70, 239, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(244, 63, 94, 0.15) 0%, transparent 40%), var(--gradient-hero)"
        }}
      >
        {/* Floating Sparks/Hearts Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] animate-bounce opacity-20 transition-all duration-1000">
            <Heart className="h-12 w-12 text-white fill-white" />
          </div>
          <div className="absolute top-[60%] right-[15%] animate-pulse opacity-20 transition-all duration-1000 delay-300">
            <Heart className="h-20 w-20 text-white fill-white" />
          </div>
          <div className="absolute bottom-[10%] left-[25%] animate-pulse opacity-10 transition-all duration-1000 delay-700">
            <Heart className="h-16 w-16 text-white fill-white" />
          </div>
          <div className="absolute top-[15%] right-[25%] animate-bounce opacity-10 transition-all duration-1000 delay-500">
            <Heart className="h-10 w-10 text-white fill-white" />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-8 backdrop-blur-md border border-white/20">
            <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-pulse"></span>
            <span className="text-sm font-medium text-white/90">Rejoignez plus de 5 millions d'utilisateurs actifs</span>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-6xl md:text-8xl lg:text-8xl mb-6 drop-shadow-sm">
            Trouvez votre partenaire <span className="text-rose-200">idéal</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl md:text-2xl text-white/80 font-light leading-relaxed">
            Arrêtez de chercher et commencez à vous connecter avec des personnes réelles qui partagent votre étincelle. Votre histoire d'amour commence d'un simple clic.
          </p>

          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-white text-rose-600 hover:bg-rose-50 transition-all hover:scale-105 shadow-xl shadow-rose-900/20" asChild>
              <Link to="/auth">Commencez votre voyage</Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-bold rounded-2xl text-white border-2 border-white/20 hover:bg-white/10 transition-all" asChild>
              <Link to="/auth">Rejoindre gratuitement</Link>
            </Button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-white/60">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">#1</span>
              <span className="text-xs uppercase tracking-widest font-bold">App de confiance</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">98%</span>
              <span className="text-xs uppercase tracking-widest font-bold">Taux de réussite</span>
            </div>
          </div>
        </div>
      </section>

      {/* Match Setup */}
      <section className="mx-auto max-w-lg px-4 py-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">Commencez vos rencontres maintenant</h2>
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          <p className="mb-1 text-center text-sm font-medium text-muted-foreground">Étape {step + 1} sur 5</p>

          {step === 0 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">Je suis...</h3>
              <div className="grid gap-3">
                <OptionButton label="Un homme" emoji="👨" selected={gender === "man"} onClick={() => setGender("man")} />
                <OptionButton label="Une femme" emoji="👩" selected={gender === "woman"} onClick={() => setGender("woman")} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">À la recherche d'un(e)...</h3>
              <div className="grid gap-3">
                <OptionButton label="Homme" emoji="👨" selected={lookingFor === "man"} onClick={() => setLookingFor("man")} />
                <OptionButton label="Femme" emoji="👩" selected={lookingFor === "woman"} onClick={() => setLookingFor("woman")} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">Tranche d'âge préférée</h3>
              <div className="grid gap-3">
                {["18–25", "25–35", "35–45", "45+"].map((range) => (
                  <OptionButton key={range} label={range} selected={ageRange === range} onClick={() => setAgeRange(range)} />
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="mb-4 text-center text-xl font-bold text-card-foreground">Votre ville/lieu</h3>
              <Input placeholder="ex. Paris, Lyon, Bordeaux..." value={location} onChange={(e) => setLocation(e.target.value)} className="text-center text-lg" />
            </>
          )}
          {step === 4 && (
            <div className="text-center">
              <h3 className="mb-2 text-xl font-bold text-card-foreground">Vous êtes prêt ! 🎉</h3>
              <p className="text-muted-foreground text-sm">Nous trouverons les meilleurs profils en fonction de vos préférences.</p>
              <div className="mt-4 space-y-1 rounded-lg bg-muted p-4 text-sm text-left">
                <p><span className="font-medium text-foreground">Genre :</span> <span className="text-muted-foreground capitalize">{gender === 'man' ? 'Homme' : 'Femme'}</span></p>
                <p><span className="font-medium text-foreground">Recherche :</span> <span className="text-muted-foreground capitalize">{lookingFor === 'man' ? 'Homme' : 'Femme'}</span></p>
                <p><span className="font-medium text-foreground">Tranche d'âge :</span> <span className="text-muted-foreground">{ageRange}</span></p>
                <p><span className="font-medium text-foreground">Lieu :</span> <span className="text-muted-foreground">{location}</span></p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="mr-1 h-4 w-4" /> Retour
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canNext()} className="flex-1">
              {step === 4 ? <>Trouver des Profils <Heart className="ml-1 h-4 w-4" /></> : <>Suivant <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured - CTA to sign up */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trouvez votre Match</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-lg">
          <Heart className="mx-auto mb-4 h-12 w-12 fill-primary text-primary" />
          <h3 className="text-xl font-bold text-foreground mb-2">Rejoignez notre communauté</h3>
          <p className="text-muted-foreground mb-6">Créez votre compte pour découvrir des profils réels près de chez vous.</p>
          <Button size="lg" asChild>
            <Link to="/auth">Commencer gratuitement</Link>
          </Button>
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
