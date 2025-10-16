// src/utils/storage.ts

export interface LevelConfig {
  name: string;
  points: number;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
  points: number;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  dob?: string;
  password?: string;
  coins: number;
  points: number;
  likedVideos: string[];
  streamerHours?: number;
  customGifts?: Gift[];
  viewerLevelConfig?: LevelConfig[]; // <-- CAMBIO: Añadida la configuración de niveles
}

const ACTIVE_KEY = "pw_active_user";
const USERS_KEY = "pw_users";

// --- Funciones de Ayuda ---
export const getUsers = (): User[] => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) as User[] : [];
};

export const saveUsers = (users: User[]) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getActiveUser = (): User | null => {
  const raw = localStorage.getItem(ACTIVE_KEY) || sessionStorage.getItem(ACTIVE_KEY);
  return raw ? JSON.parse(raw) as User : null;
};

export const setActiveUser = (u: User) =>
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(u));

export const clearActiveUser = () => {
  localStorage.removeItem(ACTIVE_KEY);
  sessionStorage.removeItem(ACTIVE_KEY);
};

export const findUserByEmail = (email: string) =>
  getUsers().find(u => u.email?.toLowerCase() === email.toLowerCase());

export const findUserByUsername = (username: string) =>
  getUsers().find(u => u.username?.toLowerCase() === username.toLowerCase());

export const createUser = (u: Omit<User, "id" | "coins" | "points" | "likedVideos"> & { password: string }) => {
  const users = getUsers();
  const user = {
    id: crypto.randomUUID(),
    name: u.name,
    username: u.username,
    email: u.email,
    phone: u.phone,
    dob: u.dob,
    password: btoa(u.password),
    coins: 0,
    points: 0,
    likedVideos: [],
    streamerHours: 0,
    customGifts: [],
    viewerLevelConfig: [], // <-- CAMBIO: Se inicializa la configuración
  } as User;
  users.push(user);
  saveUsers(users);
  return user;
};

export const verifyCredentials = (identifier: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u =>
    (u.email && u.email.toLowerCase() === identifier.toLowerCase())
    || (u.username && u.username.toLowerCase() === identifier.toLowerCase())
  );
  if (!user || !user.password) return null;
  if (user.password === btoa(password)) return user;
  return null;
};

export const updateUser = (u: User) => {
  const users = getUsers();
  const updated = users.map(x => x.id === u.id ? u : x);
  saveUsers(updated);

  const active = getActiveUser();
  if (active?.id === u.id) {
    if (localStorage.getItem(ACTIVE_KEY)) {
      setActiveUser(u);
    } else {
      sessionStorage.setItem(ACTIVE_KEY, JSON.stringify(u));
    }
  }
};