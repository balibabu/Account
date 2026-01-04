import React, { createContext, useState, useEffect, useContext } from 'react';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword } from '@react-native-firebase/auth';
import MyIndicator from '../components/MyIndicator';

const AuthContext = createContext();
const auth = getAuth();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, u => { setUser(u); setInitializing(false); });
        return unsubscribe;
    }, []);
    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);

    async function changePassword(currentPassword, newPassword) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        logout();
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, changePassword }}>
            {initializing ? <MyIndicator text={'loading user info'} /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
