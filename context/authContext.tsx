import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../app/utils/commonTypes';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

interface AuthContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  authToken: string | undefined;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
  authToken: undefined,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const auth_token = Cookies.get('authToken');
    if (auth_token) {
      setAuthToken(auth_token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
