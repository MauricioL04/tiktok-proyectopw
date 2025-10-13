// src/utils/storage.ts
export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  dob?: string; // ISO yyyy-mm-dd
  password?: string; // stored as base64 (simple simulation) — in prod: hash en backend
  coins: number;
  points: number;
  likedVideos: string[];
}

const ACTIVE_KEY = "pw_active_user";
const USERS_KEY = "pw_users";

/** users array helpers */
export const getUsers = (): User[] => {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) as User[] : [];
};
export const saveUsers = (users: User[]) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

/** active user helpers */
export const getActiveUser = (): User | null => {
  const raw = localStorage.getItem(ACTIVE_KEY);
  return raw ? JSON.parse(raw) as User : null;
};
export const setActiveUser = (u: User) =>
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(u));
export const clearActiveUser = () =>
  localStorage.removeItem(ACTIVE_KEY);

/** finders */
export const findUserByEmail = (email: string) =>
  getUsers().find(u => u.email?.toLowerCase() === email.toLowerCase());

export const findUserByUsername = (username: string) =>
  getUsers().find(u => u.username?.toLowerCase() === username.toLowerCase());

/** create user (password should be plain here; we store btoa for simulation) */
export const createUser = (u: Omit<User, "id" | "coins" | "points" | "likedVideos"> & { password: string }) => {
  const users = getUsers();
  const user = {
    id: crypto.randomUUID(),
    name: u.name,
    username: u.username,
    email: u.email,
    phone: u.phone,
    dob: u.dob,
    password: btoa(u.password), // SIMPLE SIMULATION; do NOT use btoa in prod
    coins: 0,
    points: 0,
    likedVideos: []
  } as User;
  users.push(user);
  saveUsers(users);
  return user;
};

/** verify credentials: accepts email or username plus password */
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

/** update a user object in the store */
export const updateUser = (u: User) => {
  const users = getUsers();
  const updated = users.map(x => x.id === u.id ? u : x);
  saveUsers(updated);
  // if active user is this id, update active slot too
  const active = getActiveUser();
  if (active?.id === u.id) setActiveUser(u);
};
