import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User as FirebaseUser } from "firebase/auth";
import firebaseApp from "../firebase/config";
import Loading from "../app/loading";

const auth = getAuth(firebaseApp);

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add other necessary properties from Firebase User object
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

const AuthContextProvider = ({children}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
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

    return () => unsubscribe();
  }, []);

  // Return loading state or children wrapped in AuthContext.Provider
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
