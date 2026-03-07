import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowRight, ArrowLeft, Check } from "lucide-react";

const steps = ["Gender", "Looking for", "Age range", "Location", "Find matches"];

export default function MatchSetup() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

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
      const prefs = { gender, lookingFor, ageRange, location };
      localStorage.setItem("matchPrefs", JSON.stringify(prefs));
      navigate("/discover");
    }
  };

  const OptionButton = ({
    label,
    selected,
    onClick,
    emoji,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
    emoji?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-5 text-lg font-medium transition-all ${
        selected
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40"
      }`}
    >
      {emoji && <span className="text-2xl">{emoji}</span>}
      {label}
      {selected && <Check className="ml-auto h-5 w-5 text-primary" />}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-20 md:pt-16">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <Heart className="mx-auto mb-4 h-8 w-8 fill-primary text-primary" />
          <p className="mb-1 text-center text-sm font-medium text-muted-foreground">
            Step {step + 1} of 5
          </p>

          {step === 0 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
                I am a...
              </h2>
              <div className="grid gap-3">
                <OptionButton label="Man" emoji="👨" selected={gender === "man"} onClick={() => setGender("man")} />
                <OptionButton label="Woman" emoji="👩" selected={gender === "woman"} onClick={() => setGender("woman")} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
                Looking for a...
              </h2>
              <div className="grid gap-3">
                <OptionButton label="Man" emoji="👨" selected={lookingFor === "man"} onClick={() => setLookingFor("man")} />
                <OptionButton label="Woman" emoji="👩" selected={lookingFor === "woman"} onClick={() => setLookingFor("woman")} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
                Preferred age range
              </h2>
              <div className="grid gap-3">
                {["18–25", "25–35", "35–45", "45+"].map((range) => (
                  <OptionButton key={range} label={range} selected={ageRange === range} onClick={() => setAgeRange(range)} />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">
                Your location
              </h2>
              <Input
                placeholder="e.g. Paris, London, Berlin..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-center text-lg"
              />
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">You're all set! 🎉</h2>
              <p className="text-muted-foreground">
                We'll find the best matches for you based on your preferences.
              </p>
              <div className="mt-6 space-y-1 rounded-lg bg-muted p-4 text-sm text-left">
                <p><span className="font-medium text-foreground">Gender:</span> <span className="text-muted-foreground capitalize">{gender}</span></p>
                <p><span className="font-medium text-foreground">Looking for:</span> <span className="text-muted-foreground capitalize">{lookingFor}</span></p>
                <p><span className="font-medium text-foreground">Age range:</span> <span className="text-muted-foreground">{ageRange}</span></p>
                <p><span className="font-medium text-foreground">Location:</span> <span className="text-muted-foreground">{location}</span></p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canNext()} className="flex-1">
              {step === 4 ? (
                <>Find Matches <Heart className="ml-1 h-4 w-4" /></>
              ) : (
                <>Next <ArrowRight className="ml-1 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
