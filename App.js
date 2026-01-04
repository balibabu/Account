import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';

import AppNavigator from './src/AppNavigator';
import { AppLockProvider } from './src/contexts/AppLockContext';

export default function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <AppLockProvider>
                    <AppNavigator />
                </AppLockProvider>
            </DataProvider>
        </AuthProvider>
    );
}