"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { FirebaseUser } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

const mockUser: FirebaseUser = {
  uid: 'mock-user-id',
  displayName: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  photoURL: 'https://picsum.photos/seed/1/100/100',
  providerId: 'mock',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({
    token: '',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
};


const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(mockUser);
  const [loading, setLoading] = useState(false);

  // The original onAuthStateChanged is commented out to simulate a logged-in user.
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
