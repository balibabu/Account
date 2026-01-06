import React, { createContext, useState, useEffect, useContext } from 'react';
import { deleteData, loadData, saveData } from '../utils/storageHelper';
import triggerBiometricAuth from '../utils/biometric';
import MyIndicator from '../components/MyIndicator';
import { Alert, AppState } from 'react-native';
import AppLockAuthScreen from '../screens/login/AppLockAuthScreen';

const AppLockContext = createContext();
export const AppLockProvider = ({ children }) => {

    const [initializing, setInitializing] = useState(true);
    const [isLockEnabled, setIsLockEnabled] = useState(true);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    useEffect(() => {
        checkAppLockStatus();
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (nextState !== 'active') setIsUserAuthenticated(false);
        });
        return () => subscription.remove();
    }, []);


    async function checkAppLockStatus() {
        const status = await loadData('isAppLockEnable');
        if (!status) setIsLockEnabled(false);
        setInitializing(false);
    }

    async function enableAppLock(pin) {
        await saveData('isAppLockEnable', true);
        await saveData('appLockPin', pin);
        setIsLockEnabled(true);
    }

    async function disableAppLock() {
        await deleteData('isAppLockEnable');
        await deleteData('appLockPin');
        setIsLockEnabled(false);
    }

    async function authenticateUserByBiometric() {
        triggerBiometricAuth(() => setIsUserAuthenticated(true));
    }

    async function authenticateUserByPin(pin) {
        const storedPin = await loadData('appLockPin');
        if (pin === storedPin) {
            setIsUserAuthenticated(true);
        } else {
            Alert.alert('Error', 'Incorrect PIN');
        }
    }

    if (!initializing && isLockEnabled && !isUserAuthenticated) {
        return <AppLockAuthScreen {...{authenticateUserByPin, authenticateUserByBiometric}}/>
    }

    return (
        <AppLockContext.Provider value={{ enableAppLock, isLockEnabled, disableAppLock, authenticateUserByBiometric }}>
            {initializing ? <MyIndicator text={'checking app lock enabled status'}/> : children}
        </AppLockContext.Provider>
    );
}

export const useAppLock = () => useContext(AppLockContext);