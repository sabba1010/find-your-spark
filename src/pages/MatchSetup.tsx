import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowRight, ArrowLeft, Check, Camera, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { compressImage } from "@/lib/utils";

const steps = ["Genre", "Votre Âge", "À la recherche de", "Tranche d'âge", "Lieu", "Photo de Profil", "À propos de vous", "Détails essentiels", "Trouver des Profils"];

export default function MatchSetup() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        return user.age ? user.age.toString() : "";
      } catch (e) {
        return "";
      }
    }
    return "";
  });
  const [lookingFor, setLookingFor] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const [religion, setReligion] = useState("");
  const [height, setHeight] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setProfilePic(base64);
      } catch (err) {
        toast.error("Erreur de traitement de l'image.");
      }
    }
  };

  const canNext = () => {
    if (step === 0) return !!gender;
    if (step === 1) return !!age && parseInt(age) >= 18;
    if (step === 2) return !!lookingFor;
    if (step === 3) return !!ageRange;
    if (step === 4) return !!location;
    if (step === 5) return !!profilePic;
    return true;
  };

  const handleNext = async () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      // Save to DB
      setSaving(true);
      console.log("[MatchSetup] Starting profile save...");
      try {
        const token = localStorage.getItem("token");
        const payload = { 
          gender, lookingFor, ageRange, location, photo: profilePic,
          bio, hobbies, zodiacSign, religion, height, age: parseInt(age, 10)
        };
        console.log("[MatchSetup] Sending payload:", { ...payload, photo: payload.photo ? "present (base64)" : "missing" });

        const res = await fetch(`${API}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        console.log("[MatchSetup] Response status:", res.status);
        const data = await res.json();
        
        if (!res.ok) {
          console.error("[MatchSetup] Save failed:", data);
          throw new Error(data.message || "Erreur lors de la sauvegarde.");
        }

        console.log("[MatchSetup] Save successful!");
        // Update local user cache
        localStorage.setItem("user", JSON.stringify(data.user));

        // Save prefs locally too for Discover filters
        localStorage.setItem("matchPrefs", JSON.stringify({ gender, lookingFor, ageRange, location }));

        navigate("/discover");
      } catch (err: unknown) {
        console.error("[MatchSetup] Error during save:", err);
        toast.error(err instanceof Error ? err.message : "Erreur de sauvegarde. Réessayez.");
      } finally {
        setSaving(false);
      }
    }
  };

  const OptionButton = ({
    label, selected, onClick, emoji,
  }: { label: string; selected: boolean; onClick: () => void; emoji?: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-5 text-lg font-medium transition-all ${selected ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-card text-foreground hover:border-primary/40"
        }`}
    >
      {emoji && <span className="text-2xl">{emoji}</span>}
      {label}
      {selected && <Check className="ml-auto h-5 w-5 text-primary" />}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-20 md:pt-16">
      <div className="w-full max-w-lg relative">
        {saving && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
            <Heart className="mb-4 h-12 w-12 animate-pulse fill-primary text-primary" />
            <p className="text-lg font-bold text-foreground">Sauvegarde en cours...</p>
            <p className="text-sm text-muted-foreground text-center px-4 mt-1">Ceci peut prendre quelques secondes si vous avez ajouté une photo de haute qualité.</p>
          </div>
        )}
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <Heart className="mx-auto mb-4 h-8 w-8 fill-primary text-primary" />
          <p className="mb-1 text-center text-sm font-medium text-muted-foreground">Étape {step + 1} sur {steps.length}</p>

          {step === 0 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">Je suis...</h2>
              <div className="grid gap-3">
                <OptionButton label="Un Homme" emoji="👨" selected={gender === "man"} onClick={() => setGender("man")} />
                <OptionButton label="Une Femme" emoji="👩" selected={gender === "woman"} onClick={() => setGender("woman")} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">Votre Âge</h2>
              <p className="mb-4 text-center text-muted-foreground">Veuillez confirmer votre âge pour de meilleurs matchs.</p>
              <Input
                type="number"
                min={18}
                max={99}
                placeholder="ex. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="text-center text-2xl h-16 font-bold"
              />
              <p className="mt-4 text-center text-xs text-muted-foreground">Vous devez avoir au moins 18 ans.</p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">À la recherche d'un(e)...</h2>
              <div className="grid gap-3">
                <OptionButton label="Homme" emoji="👨" selected={lookingFor === "man"} onClick={() => setLookingFor("man")} />
                <OptionButton label="Femme" emoji="👩" selected={lookingFor === "woman"} onClick={() => setLookingFor("woman")} />
                <OptionButton label="Tous les deux" emoji="👫" selected={lookingFor === "everyone"} onClick={() => setLookingFor("everyone")} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">Tranche d'âge préférée</h2>
              <div className="grid gap-3">
                {["18–25", "25–35", "35–45", "45+"].map((range) => (
                  <OptionButton key={range} label={range} selected={ageRange === range} onClick={() => setAgeRange(range)} />
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="mb-6 text-center text-2xl font-bold text-card-foreground">Votre ville/lieu</h2>
              <Input
                placeholder="ex. Paris, Lyon, Bordeaux..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-center text-lg"
              />
            </>
          )}

          {step === 5 && (
            <div className="text-center">
              <h2 className="mb-6 text-2xl font-bold text-card-foreground">Votre Photo</h2>
              <div className="relative mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50 transition-colors hover:border-primary/50">
                {profilePic ? (
                  <div className="relative h-full w-full">
                    <img src={profilePic} alt="Aperçu" className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfilePic(null);
                      }}
                      className="absolute top-2 right-2 rounded-full bg-rose-500 p-2 text-white shadow-lg z-10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Camera className="h-12 w-12 text-muted-foreground/50" />
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-white shadow-lg hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                {profilePic ? "Changer la Photo" : "Choisir une Photo"}
              </Button>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-center text-2xl font-bold text-card-foreground">À propos de vous</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground text-left block">Votre Bio</label>
                  <textarea
                    placeholder="Parlez-nous de vous..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground text-left block">Loisirs (Hobbies)</label>
                  <Input
                    placeholder="Musique, Voyage, Cuisine..."
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-center text-2xl font-bold text-card-foreground">Détails essentiels</h2>
              <div className="grid gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-foreground">Signe Astrologique</label>
                  <select
                    value={zodiacSign}
                    onChange={(e) => setZodiacSign(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionner</option>
                    {["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"].map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-foreground">Religion (Facultatif)</label>
                  <Input value={religion} onChange={(e) => setReligion(e.target.value)} placeholder="Religion" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-foreground">Taille (cm)</label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="ex: 175" />
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-card-foreground">Vous êtes prêt ! 🎉</h2>
              <p className="text-muted-foreground">Nous trouverons les meilleurs profils pour vous.</p>
              <div className="mt-6 flex flex-col items-center gap-6 rounded-lg bg-muted p-6">
                {profilePic && (
                  <img src={profilePic} alt="Profil" className="h-24 w-24 rounded-full object-cover shadow-md border-2 border-white" />
                )}
                <div className="w-full space-y-2 text-sm text-left">
                  <p><span className="font-medium text-foreground">Âge :</span> <span className="text-muted-foreground">{age} ans</span></p>
                  <p><span className="font-medium text-foreground">Genre :</span> <span className="text-muted-foreground capitalize">{gender === 'man' ? 'Homme' : (gender === 'woman' ? 'Femme' : 'Autre')}</span></p>
                  <p><span className="font-medium text-foreground">Lieu :</span> <span className="text-muted-foreground">{location}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="mr-1 h-4 w-4" /> Retour
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canNext() || saving} className="flex-1">
              {step === 8 ? (
                saving ? "Sauvegarde..." : <><span>Trouver des Profils</span> <Heart className="ml-1 h-4 w-4" /></>
              ) : (
                <>Suivant <ArrowRight className="ml-1 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
