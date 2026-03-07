import { useMemo } from "react";
import ProfileCard from "@/components/ProfileCard";
import { fakeUsers } from "@/data/users";

function getAgeRange(range: string): [number, number] {
  if (range === "18–25") return [18, 25];
  if (range === "25–35") return [25, 35];
  if (range === "35–45") return [35, 45];
  if (range === "45+") return [45, 100];
  return [18, 100];
}

const matchPercentages: Record<string, number> = {
  "1": 92, "2": 87, "3": 78, "4": 95, "5": 83, "6": 71,
};

export default function Discover() {
  const filteredUsers = useMemo(() => {
    const raw = localStorage.getItem("matchPrefs");
    if (!raw) return fakeUsers;

    const prefs = JSON.parse(raw) as {
      lookingFor: string;
      ageRange: string;
      location: string;
    };

    const [minAge, maxAge] = getAgeRange(prefs.ageRange);

    return fakeUsers.filter((u) => {
      if (prefs.lookingFor && u.gender !== prefs.lookingFor) return false;
      if (u.age < minAge || u.age > maxAge) return false;
      return true;
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:pt-20">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Vos Profils</h1>
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">Aucun profil trouvé pour vos préférences.</p>
          <a href="/match-setup" className="mt-4 text-sm font-medium text-primary hover:underline">
            Mettre à jour vos préférences
          </a>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <ProfileCard key={user.id} user={user} matchPercent={matchPercentages[user.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
