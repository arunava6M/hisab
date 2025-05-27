import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../app/utils/commonTypes';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

interface AuthContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  authToken: string | undefined;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
  authToken: undefined,
  setAuthToken: () => null,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({
  children,
  authToken: authProp,
}: {
  children: React.ReactNode;
  authToken: string;
}): React.ReactNode => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(authProp);
  // console.log('aith: ', authToken);
  // useEffect(() => {
  //   const auth_token = Cookies.get('authToken');
  //   if (auth_token) {
  //     setAuthToken(auth_token);
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
