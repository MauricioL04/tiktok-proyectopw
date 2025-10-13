// src/utils/validators.ts
export const passwordMeetsRules = (pwd: string) => {
  // ejemplo de reglas: 8+ chars, mayúscula, minúscula, número
  const length = pwd.length >= 8;
  const upper = /[A-Z]/.test(pwd);
  const lower = /[a-z]/.test(pwd);
  const number = /[0-9]/.test(pwd);
  return { ok: length && upper && lower && number, length, upper, lower, number };
};

export const usernameAllowed = (u: string) => {
  // alfanuméricos y guion bajo, 3-24 chars
  return /^[a-zA-Z0-9_]{3,24}$/.test(u);
}
