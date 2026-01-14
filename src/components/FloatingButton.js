import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingButton = ({ iconName = "add", onPress, style }) => {
    return (
        <TouchableOpacity style={[styles.fab, style]} onPress={onPress}>
            <Icon name={iconName} size={30} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#4A90E2',
        borderRadius: 20,
        elevation: 5,
        borderColor: '#2873c9',
        borderWidth: 3
    },
});

export default FloatingButton;