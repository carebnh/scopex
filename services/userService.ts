
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
    password: '2240@SCOPEX',
    role: 'SUPER_ADMIN',
    fullName: 'Root Administrator'
  }
];

export const initializeUsers = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  } else {
    // Force update the root-admin password if the code defaults changed
    const users: CRMUser[] = JSON.parse(existing);
    const rootIndex = users.findIndex(u => u.id === 'root-admin');
    if (rootIndex !== -1) {
      if (users[rootIndex].password !== DEFAULT_USERS[0].password) {
        users[rootIndex].password = DEFAULT_USERS[0].password;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      }
    }
  }
};

export const getAllUsers = (): CRMUser[] => {
  initializeUsers();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const saveUser = (user: Omit<CRMUser, 'id'>): boolean => {
  const users = getAllUsers();
  const normalizedEmail = user.email.toLowerCase().trim();
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) return false;
  
  const newUser = { ...user, email: normalizedEmail, id: 'user_' + Date.now() };
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
  initializeUsers(); 
  const users = getAllUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === pass);
  return found || null;
};
