import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // Demo hesabı kontrolü
    if (email === 'demo@example.com' && password === 'demo123') {
      set({
        isAuthenticated: true,
        user: {
          id: 'demo',
          name: 'Demo Kullanıcı',
          email: 'demo@example.com',
          role: 'user',
        },
      });
    } else {
      throw new Error('Geçersiz kullanıcı adı veya şifre');
    }
  },
  register: async (name: string, email: string, password: string) => {
    // Gerçek uygulamada burada API çağrısı yapılacak
    // Şimdilik sadece başarılı kayıt simülasyonu
    console.log('Yeni kullanıcı kaydı:', { name, email });
    // Kayıt başarılı mesajı
    return Promise.resolve();
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));