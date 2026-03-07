export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  gender: "man" | "woman";
  photo: string;
  bio: string;
}

export const fakeUsers: User[] = [
  {
    id: "1",
    name: "Emma",
    age: 26,
    location: "Paris",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    bio: "Amoureuse du café ☕ | Passionnée d'art 🎨 | À la recherche de connexions authentiques",
  },
  {
    id: "2",
    name: "Lucas",
    age: 30,
    location: "Lyon",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    bio: "Aventurier 🏔️ | Gourmand | À la recherche de ma complice",
  },
  {
    id: "3",
    name: "Sofia",
    age: 24,
    location: "Madrid",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    bio: "Danse à travers la vie 💃 | Accro aux voyages ✈️ | Maman d'un chien 🐕",
  },
  {
    id: "4",
    name: "Daniel",
    age: 29,
    location: "Berlin",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    bio: "Passionné de tech 💻 | Collectionneur de vinyles 🎵 | Chef du week-end 👨‍🍳",
  },
  {
    id: "5",
    name: "Chloe",
    age: 27,
    location: "Amsterdam",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    bio: "Yoga & méditation 🧘‍♀️ | Alimentation végétale 🌱 | Dévoreuse de livres 📚",
  },
  {
    id: "6",
    name: "Marco",
    age: 31,
    location: "Rome",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
    bio: "Photographe 📷 | Accro à l'espresso | La vie est belle",
  },
];

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  userId: string;
  messages: Message[];
}

export const fakeChats: Chat[] = [
  {
    userId: "1",
    messages: [
      { id: "m1", senderId: "1", text: "Salut ! Comment vas-tu ? 😊", timestamp: "10:30 AM" },
      { id: "m2", senderId: "me", text: "Salut Emma ! Je vais super bien, et toi ?", timestamp: "10:32 AM" },
      { id: "m3", senderId: "1", text: "Ça va bien ! J'adore ton profil 💕", timestamp: "10:33 AM" },
    ],
  },
  {
    userId: "3",
    messages: [
      { id: "m4", senderId: "me", text: "Salut Sofia ! J'adore Madrid 🇪🇸", timestamp: "Hier" },
      { id: "m5", senderId: "3", text: "Merci ! Tu as déjà visité ?", timestamp: "Hier" },
    ],
  },
  {
    userId: "4",
    messages: [
      { id: "m6", senderId: "4", text: "Hé, ravi de te rencontrer !", timestamp: "Il y a 2 jours" },
    ],
  },
];
