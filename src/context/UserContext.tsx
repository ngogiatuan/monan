import React, { createContext, useState } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: (user: any) => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
