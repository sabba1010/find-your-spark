import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDefaultAvatar(gender?: string | null): string {
  if (gender === "woman") return "/avatar-female.jpg";
  return "/avatar-male.jpg";
}
