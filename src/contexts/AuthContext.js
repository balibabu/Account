import React, {createContext, useState, useEffect, useContext} from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';

const AuthContext = createContext();
const auth = getAuth();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{user, login, logout, initializing}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
