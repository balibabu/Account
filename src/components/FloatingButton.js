import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingButton = ({ iconName = "add", onPress, style }) => {
    return (
        <TouchableOpacity 
            style={[styles.fab, style]} 
            onPress={onPress}
            activeOpacity={0.5}
        >
            <Icon name={iconName} size={30} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#4A90E2',
        borderRadius: 28, // Half of width/height for perfect circle
        // Android Shadow
        elevation: 5,
        // iOS Shadow
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
});

export default FloatingButton;