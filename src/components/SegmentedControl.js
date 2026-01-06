import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { fonts } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

const SegmentedControl = ({ options, activeOption, onChange }) => {
    // 1. Calculate the width of the container (accounting for padding)
    const containerWidth = screenWidth - 48; // Adjust based on your screen padding
    const itemWidth = containerWidth / options.length;
    
    // 2. Setup the Animated Value
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 3. Find index of active option and animate to that position
        const index = options.indexOf(activeOption);
        Animated.spring(translateX, {
            toValue: index * itemWidth,
            useNativeDriver: true,
            bounciness: 10, // Gives it a nice organic "snap"
        }).start();
    }, [activeOption]);

    return (
        <View style={[styles.container, { width: containerWidth }]}>
            {/* The Sliding Background */}
            <Animated.View 
                style={[
                    styles.slider, 
                    { 
                        width: itemWidth - 12, // padding adjustment
                        transform: [{ translateX: translateX }] 
                    }
                ]} 
            />

            {/* The Buttons */}
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={styles.btn}
                    onPress={() => onChange(option)}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.text, 
                        activeOption === option ? styles.activeText : styles.inactiveText
                    ]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent like your header
        borderRadius: 12,
        // padding: 4,
        // position: 'relative',
        height: 45,
        // alignItems: 'center',


        // 1. Make the background slightly darker than your Aqua surface
        // backgroundColor: '#F8FAFC', 
    
        // 2. The "Pit" Border Trick
        borderTopWidth: 2.5,        // Thick top shadow
        borderLeftWidth: 1.5,       // Medium left shadow
        borderBottomWidth: 0.5,     // Thin bottom highlight
        borderRightWidth: 0.5,      // Thin right highlight
        
        // 3. Shadow colors (Darker Aqua-Grays)
        borderTopColor: '#427fc7', 
        borderLeftColor: '#427fc7', 
        
        // 4. Highlight colors (White/Clean Aqua)
        borderBottomColor: '#427fc7', 
        borderRightColor: '#427fc7',
    },
    slider: {
        position: 'absolute',
        height: 33,
        top: 4,
        left: 5,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Keep text above the slider
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeText: {
        color: '#4A90E2', // Your brand blue
    },
    inactiveText: {
        color: '#E0E0E0',
    },
});

export default SegmentedControl;