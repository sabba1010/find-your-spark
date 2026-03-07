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
    bio: "Coffee lover ☕ | Art enthusiast 🎨 | Seeking genuine connections",
  },
  {
    id: "2",
    name: "Lucas",
    age: 30,
    location: "Lyon",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    bio: "Outdoor adventurer 🏔️ | Foodie | Looking for my partner in crime",
  },
  {
    id: "3",
    name: "Sofia",
    age: 24,
    location: "Madrid",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    bio: "Dancing through life 💃 | Travel addict ✈️ | Dog mom 🐕",
  },
  {
    id: "4",
    name: "Daniel",
    age: 29,
    location: "Berlin",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    bio: "Tech geek 💻 | Vinyl collector 🎵 | Weekend chef 👨‍🍳",
  },
  {
    id: "5",
    name: "Chloe",
    age: 27,
    location: "Amsterdam",
    gender: "woman",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    bio: "Yoga & meditation 🧘‍♀️ | Plant-based 🌱 | Bookworm 📚",
  },
  {
    id: "6",
    name: "Marco",
    age: 31,
    location: "Rome",
    gender: "man",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
    bio: "Photographer 📷 | Espresso addict | Life is beautiful",
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
      { id: "m1", senderId: "1", text: "Hey! How are you? 😊", timestamp: "10:30 AM" },
      { id: "m2", senderId: "me", text: "Hi Emma! I'm great, you?", timestamp: "10:32 AM" },
      { id: "m3", senderId: "1", text: "Doing well! Love your profile 💕", timestamp: "10:33 AM" },
    ],
  },
  {
    userId: "3",
    messages: [
      { id: "m4", senderId: "me", text: "Hi Sofia! Love Madrid 🇪🇸", timestamp: "Yesterday" },
      { id: "m5", senderId: "3", text: "Thanks! Have you visited?", timestamp: "Yesterday" },
    ],
  },
  {
    userId: "4",
    messages: [
      { id: "m6", senderId: "4", text: "Hey, nice to meet you!", timestamp: "2 days ago" },
    ],
  },
];
