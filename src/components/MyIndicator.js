import { ActivityIndicator, Text, View } from "react-native";

export default function MyIndicator({ text, size = "large", color = "#0000ff" }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator {...{ size, color }} />
            <Text style={{ marginTop: 10, color: '#666' }}>{text}</Text>
        </View>
    );
}



