// Shared types for the application
export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: "man" | "woman";
  photo: string;
  bio: string;
  matchPercent?: number;
}
