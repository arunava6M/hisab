import React, { createContext, useContext, useState } from 'react';
import { UserType } from '../app/utils/commonTypes';

interface AuthContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [user, setUser] = useState<UserType | null>(null);

  // Return loading state or children wrapped in AuthContext.Provider
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
