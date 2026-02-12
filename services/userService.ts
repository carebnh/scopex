
export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'VIEWER';

export interface CRMUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
}

const STORAGE_KEY = 'scopex_crm_users';

const DEFAULT_USERS: CRMUser[] = [
  {
    id: 'root-admin',
    email: 'admin@scopex.com',
    password: '2240@Sopex',
    role: 'SUPER_ADMIN',
    fullName: 'Root Administrator'
  }
];

export const initializeUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

export const getAllUsers = (): CRMUser[] => {
  initializeUsers();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const saveUser = (user: Omit<CRMUser, 'id'>): boolean => {
  const users = getAllUsers();
  if (users.some(u => u.email === user.email)) return false;
  
  const newUser = { ...user, id: 'user_' + Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...users, newUser]));
  return true;
};

export const removeUser = (id: string): boolean => {
  if (id === 'root-admin') return false; // Protect root
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const validateLogin = (email: string, pass: string): CRMUser | null => {
  const users = getAllUsers();
  const found = users.find(u => u.email === email && u.password === pass);
  return found || null;
};
