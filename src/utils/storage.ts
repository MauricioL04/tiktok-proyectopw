export type Role = 'streamer' | 'espectador';
export interface User {
  id: string; name: string; email: string; role: Role; coins: number; points: number;
}
const KEY = 'pw_user';
export const saveUser = (u: User) => localStorage.setItem(KEY, JSON.stringify(u));
export const getUser = (): User | null => {
  const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as User : null;
};
export const clearUser = () => localStorage.removeItem(KEY);
