import { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Globe, SlidersHorizontal, X } from "lucide-react";

export interface MatchedUser {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: "man" | "woman";
  photo: string;
  bio: string;
  matchPercent?: number;
}

export default function Discover() {
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [perfectMatches, setPerfectMatches] = useState<MatchedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    radius: "50",
    searchLevel: "worldwide",
    filterCountry: "",
    filterDept: "",
    smoke: "",
    alcohol: "",
    children: "",
    religion: "",
    zodiacSign: "",
    minHeight: "",
    maxHeight: "",
    ageMin: "",
    ageMax: "",
    eyeColor: "",
    hairColor: "",
    keyword: ""
  });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const canUseAdvanced = currentUser.planName?.includes('Premium') || currentUser.planName?.includes('Prestige');

  useEffect(() => {
    fetchPerfectMatches();
    fetchMatches();
  }, [navigate]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchPerfectMatches = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch without mode=discover to get strict mutual matches (defaults to searchLevel=worldwide or user pref)
      const res = await fetch(`${API}/users/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Only take the top 5 for the horizontal slider
        setPerfectMatches(data.matches.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch perfect matches:", err);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Veuillez vous connecter.");
      navigate("/auth");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const { radius, searchLevel, filterCountry, filterDept, smoke, alcohol, children, religion, zodiacSign, minHeight, maxHeight } = filters;
      
      let url = `${API}/users/matches?searchLevel=${searchLevel}&mode=discover`;
      
      if (searchLevel === 'radius' && user.locationCoords?.coordinates) {
        url += `&radius=${radius}&lat=${user.locationCoords.coordinates[1]}&lng=${user.locationCoords.coordinates[0]}`;
      } else if (searchLevel === 'country') {
        url += `&filterCountry=${encodeURIComponent(filterCountry || user.country || '')}`;
      } else if (searchLevel === 'department') {
        url += `&filterDept=${encodeURIComponent(filterDept || user.department || '')}`;
      }

      if (smoke) url += `&smoke=${smoke}`;
      if (alcohol) url += `&alcohol=${alcohol}`;
      if (children) url += `&children=${children}`;
      if (religion) url += `&religion=${religion}`;
      if (zodiacSign) url += `&zodiacSign=${zodiacSign}`;
      if (minHeight) url += `&minHeight=${minHeight}`;
      if (maxHeight) url += `&maxHeight=${maxHeight}`;
      if (filters.ageMin) url += `&ageMin=${filters.ageMin}`;
      if (filters.ageMax) url += `&ageMax=${filters.ageMax}`;
      if (filters.eyeColor) url += `&eyeColor=${encodeURIComponent(filters.eyeColor)}`;
      if (filters.hairColor) url += `&hairColor=${encodeURIComponent(filters.hairColor)}`;
      if (filters.keyword) url += `&keyword=${encodeURIComponent(filters.keyword)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const isFree = user.planName === 'Free Registration' || !user.planName;
      setMatches(isFree ? data.matches.slice(0, 5) : data.matches);

    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Recherche de profils...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 md:pt-32">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Découvrir</h1>
          <p className="text-sm text-muted-foreground">{matches.length} profil{matches.length !== 1 ? "s" : ""} trouvé{matches.length !== 1 ? "s" : ""}</p>
        </div>
        <Button 
          variant={showFilters ? "secondary" : "outline"} 
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres avancés
        </Button>
      </div>

      {!showFilters && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                 <span className="text-xl">✨</span> Matchs Parfaits
              </h2>
           </div>
           
           {perfectMatches.length > 0 ? (
             <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                {perfectMatches.map((user) => (
                  <ProfileCard 
                    key={user.id} 
                    user={user} 
                    matchPercent={user.matchPercent} 
                    onAction={() => { fetchPerfectMatches(); fetchMatches(); }}
                  />
                ))}
             </div>
           ) : (
             <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-muted/5">
                <p className="text-sm text-muted-foreground">No matches found at the moment. Try expanding your preferences in Discover!</p>
             </div>
           )}
           
           <div className="my-8 border-t border-border" />
           
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Globe className="h-5 w-5 text-primary" /> Explorer
           </h2>
        </div>
      )}

      {showFilters && (
        <div className="mb-8 rounded-2xl bg-card p-6 border border-border shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Critères de recherche
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/70">Localisation</h3>
              <div className="space-y-3">
                <select 
                  name="searchLevel" 
                  value={filters.searchLevel} 
                  onChange={handleFilterChange}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
                >
                  <option value="worldwide">🌍 Monde entier</option>
                  <option value="country">🇫🇷 Mon Pays</option>
                  <option value="department">🏠 Mon Département</option>
                  <option value="radius">📍 À proximité (Radius)</option>
                </select>

                {filters.searchLevel === 'radius' && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Distance : {filters.radius}km</label>
                    <input 
                      type="range" 
                      name="radius" 
                      min="1" 
                      max="500" 
                      value={filters.radius} 
                      onChange={handleFilterChange}
                      className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/70">Style de vie</h3>
              <div className="grid grid-cols-1 gap-3">
                <select 
                  name="smoke" 
                  value={filters.smoke} 
                  onChange={handleFilterChange}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Fumeur ? (Peu importe)</option>
                  <option value="Non-fumeur">Non-fumeur</option>
                  <option value="Fumeur occasionnel">Fumeur occasionnel</option>
                  <option value="Fumeur régulier">Fumeur régulier</option>
                </select>

                <select 
                  name="alcohol" 
                  value={filters.alcohol} 
                  onChange={handleFilterChange}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Alcool ? (Peu importe)</option>
                  <option value="never">Jamais</option>
                  <option value="occasionally">Occasionnellement</option>
                  <option value="regularly">Régulièrement</option>
                </select>

                <select 
                  name="children" 
                  value={filters.children} 
                  onChange={handleFilterChange}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Enfants ? (Peu importe)</option>
                  <option value="Pas d'enfants">Pas d'enfants</option>
                  <option value="A des enfants">A des enfants</option>
                  <option value="Souhaite en avoir">Souhaite en avoir</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters Section */}
            <div className="space-y-4 relative">
              {!canUseAdvanced && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl border border-primary/20 p-4 text-center">
                   <div className="bg-background p-4 rounded-xl shadow-lg border flex flex-col items-center">
                     <span className="text-2xl mb-2">⭐</span>
                     <h4 className="font-bold text-sm mb-1">Critères Avancés verrouillés</h4>
                     <p className="text-xs text-muted-foreground mb-3 max-w-[200px]">Passez à Premium pour affiner votre recherche par taille, couleur des yeux, mot-clé, etc.</p>
                     <Button size="sm" onClick={() => navigate('/plans')} className="w-full text-xs font-bold rounded-lg h-8">
                       Débloquer (Premium)
                     </Button>
                   </div>
                </div>
              )}
              
              <div className={`transition-opacity duration-300 ${!canUseAdvanced ? 'opacity-30 pointer-events-none blur-[1px]' : ''}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-4">Critères Avancés</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex gap-2">
                    <Input 
                      type="number"
                      name="ageMin" 
                      value={filters.ageMin} 
                      onChange={handleFilterChange} 
                      placeholder="Âge min" 
                      className="flex-1"
                    />
                    <Input 
                      type="number"
                      name="ageMax" 
                      value={filters.ageMax} 
                      onChange={handleFilterChange} 
                      placeholder="Âge max" 
                      className="flex-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select 
                      name="eyeColor" 
                      value={filters.eyeColor} 
                      onChange={handleFilterChange}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Yeux (Tous)</option>
                      <option value="Bleu">Bleu</option>
                      <option value="Vert">Vert</option>
                      <option value="Marron">Marron</option>
                      <option value="Gris">Gris</option>
                      <option value="Noisette">Noisette</option>
                    </select>
                    <select 
                      name="hairColor" 
                      value={filters.hairColor} 
                      onChange={handleFilterChange}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Cheveux (Tous)</option>
                      <option value="Noir">Noir</option>
                      <option value="Brun">Brun</option>
                      <option value="Blond">Blond</option>
                      <option value="Roux">Roux</option>
                      <option value="Gris">Gris</option>
                      <option value="Blanc">Blanc</option>
                    </select>
                  </div>

                  <Input 
                    type="text"
                    name="keyword" 
                    value={filters.keyword} 
                    onChange={handleFilterChange} 
                    placeholder="Mot-clé (ex: sport, cuisine...)" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setFilters({
               radius: "50", searchLevel: "worldwide", filterCountry: "", filterDept: "", 
               smoke: "", alcohol: "", children: "", religion: "", zodiacSign: "", minHeight: "", maxHeight: "",
               ageMin: "", ageMax: "", eyeColor: "", hairColor: "", keyword: ""
            })}>
              Réinitialiser
            </Button>
            <Button onClick={() => { fetchMatches(); setShowFilters(false); }} className="px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              Appliquer les filtres
            </Button>
          </div>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5 animate-in fade-in zoom-in duration-500">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Aucun match trouvé</h2>
          <p className="max-w-xs text-muted-foreground text-sm">
            No matches found at the moment. Try expanding your preferences in Discover!
          </p>
          <Button variant="outline" onClick={() => setShowFilters(true)} className="mt-6 rounded-xl">
            Modifier mes filtres
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {matches.map((user) => (
            <ProfileCard 
              key={user.id} 
              user={user} 
              matchPercent={user.matchPercent} 
              onAction={() => { fetchPerfectMatches(); fetchMatches(); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
