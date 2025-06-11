import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  // Добавь другие поля, если есть
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');

  if (storedToken) {
    console.log('Текущий токен:', storedToken); // Для диагностики
  }

  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }
}, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return { user, token, logout };
};
