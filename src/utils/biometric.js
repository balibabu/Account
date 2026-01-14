import { Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();
export default async function triggerBiometricAuth(onSuccess = () => { }) {
    try {
        const { success } = await rnBiometrics.simplePrompt({
            promptMessage: 'Unlock App',
            cancelButtonText: 'Use PIN',
        });
        if (success) onSuccess();
    } catch (error) {
        Alert.alert("Error occured !!!", error.message);
    }
}
