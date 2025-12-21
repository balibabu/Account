import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';

// Get screen width to calculate tab width
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 3; // 3 tabs

export default function CustomTabBar({ state, descriptors, navigation }) {
  // Shared value for the sliding indicator position
  const translateX = useSharedValue(0);

  // Update position when index changes
  React.useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 15,
      stiffness: 100,
    });
  }, [state.index]);

  // Animated style for the sliding indicator
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.tabContainer}>
      {/* The Animated Indicator */}
      <Animated.View style={[styles.slider, animatedStyle]} />

      {/* Loop over the routes (tabs) */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
          >
            {/* You can replace these Text/Emojis with Icons */}
            <Text style={[styles.tabText, { color: isFocused ? '#fff' : '#222' }]}>
              {label === 'Home' ? '🏠' : label === 'Details' ? '📄' : '⚙️'}
            </Text>
            <Text style={[styles.label, { color: isFocused ? '#fff' : '#222' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    elevation: 2,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute', // Floating effect
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 35,
    overflow: 'hidden', // Clip the slider
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  slider: {
    position: 'absolute',
    width: TAB_WIDTH - 13.5, // Adjust width slightly for padding calculation
    height: '100%',
    backgroundColor: '#6200ea', // Active tab color
    borderRadius: 35,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});