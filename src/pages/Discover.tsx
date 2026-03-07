import ProfileCard from "@/components/ProfileCard";
import { fakeUsers } from "@/data/users";

const matchPercentages = [92, 87, 78, 95, 83, 71];

export default function Discover() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:pt-20">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Discover</h1>
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
        {fakeUsers.map((user, i) => (
          <ProfileCard key={user.id} user={user} matchPercent={matchPercentages[i]} />
        ))}
      </div>
    </div>
  );
}
