import React, { createContext, useState } from 'react';

export interface IUser {
  name: string;
  email: string;
  avatar: any;
  joined?: string;
  point?: number;
  [key: string]: any;
}

interface IUserContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
