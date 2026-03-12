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
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    radius: "50",
    searchLevel: "worldwide",
    filterCountry: "",
    filterDept: ""
  });
  const navigate = useNavigate();

    fetchMatches();
  }, [navigate, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
      const { radius, searchLevel, filterCountry, filterDept } = filters;
      
      let url = `${API}/users/matches?searchLevel=${searchLevel}`;
      
      if (searchLevel === 'radius' && user.locationCoords?.coordinates) {
        url += `&radius=${radius}&lat=${user.locationCoords.coordinates[1]}&lng=${user.locationCoords.coordinates[0]}`;
      } else if (searchLevel === 'country') {
        url += `&filterCountry=${encodeURIComponent(filterCountry || user.country || '')}`;
      } else if (searchLevel === 'department') {
        url += `&filterDept=${encodeURIComponent(filterDept || user.department || '')}`;
      }

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
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:pt-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Découvrir</h1>
          <p className="text-sm text-muted-foreground">{matches.length} profil{matches.length !== 1 ? "s" : ""} trouvé{matches.length !== 1 ? "s" : ""}</p>
        </div>
        <Button 
          variant={showFilters ? "secondary" : "outline"} 
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-full gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      {showFilters && (
        <div className="mb-8 rounded-2xl bg-card p-6 border border-border shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Options de Recherche
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rayon de recherche</label>
              <select 
                name="searchLevel" 
                value={filters.searchLevel} 
                onChange={handleFilterChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="worldwide">🌍 Monde entier</option>
                <option value="country">🇫🇷 Mon Pays</option>
                <option value="department">🏠 Mon Département</option>
                <option value="radius">📍 À proximité (Radius)</option>
              </select>
            </div>

            {filters.searchLevel === 'radius' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Distance (km) : {filters.radius}km</label>
                <input 
                  type="range" 
                  name="radius" 
                  min="1" 
                  max="500" 
                  value={filters.radius} 
                  onChange={handleFilterChange}
                  className="w-full accent-primary"
                />
              </div>
            )}

            {filters.searchLevel === 'country' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pays Spécifique</label>
                <Input 
                  name="filterCountry" 
                  value={filters.filterCountry} 
                  onChange={handleFilterChange} 
                  placeholder="ex: France" 
                />
              </div>
            )}

            {filters.searchLevel === 'department' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Département Spécifique</label>
                <Input 
                  name="filterDept" 
                  value={filters.filterDept} 
                  onChange={handleFilterChange} 
                  placeholder="ex: Paris" 
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={fetchMatches} className="gap-2">
              Appliquer les filtres
            </Button>
          </div>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">Aucun profil trouvé pour vos préférences.</p>
          <a href="/match-setup" className="mt-4 text-sm font-medium text-primary hover:underline">
            Mettre à jour vos préférences
          </a>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
          {matches.map((user) => (
            <ProfileCard key={user.id} user={user} matchPercent={user.matchPercent} />
          ))}
        </div>
      )}
    </div>
  );
}
