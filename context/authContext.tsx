import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  getAuth,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseApp from '../firebase/config';
import Loading from '../app/loading';
import { Preferences } from '@capacitor/preferences';

const auth = getAuth(firebaseApp);

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log('user from authContext: ', user);
  console.log('auth currentUser: ', auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log('firebaseUser: ', firebaseUser);
        const userInfo: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  // Return loading state or children wrapped in AuthContext.Provider
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
