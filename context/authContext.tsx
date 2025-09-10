import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '../app/utils/commonTypes';
import { getUserDetails } from '@utils/api';
import { genericCatch, getAuthToken } from '@utils/helper';

interface AuthContextType {
  user: UserType | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const authToken = getAuthToken();
    const getUser = async () => {
      try {
        const resp = await getUserDetails(authToken);
        setUser(resp.data);
      } catch (error) {
        genericCatch(error);
      }
    };

    if (authToken) {
      getUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
