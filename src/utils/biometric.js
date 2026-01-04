import { Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();
export default async function triggerBiometricAuth(onSuccess = () => { }) {
    try {
        const { success } = await rnBiometrics.simplePrompt();
        if (success) onSuccess();
    } catch (error) {
        Alert.alert("Something went wrong.", 'Biometrics cancelled or failed');
    }
}
