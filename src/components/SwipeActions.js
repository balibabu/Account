import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    useAnimatedStyle, interpolate, Extrapolation,
    useSharedValue, withTiming, runOnJS, useAnimatedReaction
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SwipeActions({ children, onDelete, onEdit }) {
    const rowHeight = useSharedValue(70); // Matches your TransactionItem height
    const opacity = useSharedValue(1);

    const finishDismiss = () => {
        // Step 3: Call the actual delete function after animation
        onDelete();
    };

    const triggerDismiss = () => {
        // Step 2: Collapse height and fade out
        rowHeight.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(finishDismiss)();
        });
        opacity.value = withTiming(0);
    };

    const renderRightActions = (progress, drag) => {
        // Step 1: Monitor swipe distance
        useAnimatedReaction(
            () => drag.value,
            (currentDrag) => {
                if (currentDrag < -200 && rowHeight.value !== 0) {
                    runOnJS(triggerDismiss)();
                }
            }
        );

        return (
            <View style={styles.rightActions}>
                <ActionButton icon="create-outline" color="#4F46E5" drag={drag} onPress={onEdit} range={[-100, -50]} />
                <ActionButton icon="trash-outline" color="#EF4444" drag={drag} onPress={onDelete} range={[-50, 0]} />
            </View>
        );
    };

    const animatedRowStyle = useAnimatedStyle(() => ({
        height: rowHeight.value,
        opacity: opacity.value,
        overflow: 'hidden',
    }));

    return (
        <Reanimated.View style={animatedRowStyle}>
            <ReanimatedSwipeable friction={2} rightThreshold={40} renderRightActions={renderRightActions} containerStyle={styles.swipeContainer}>
                {children}
            </ReanimatedSwipeable>
        </Reanimated.View>
    );
}

const ActionButton = ({ icon, color, drag, onPress, range }) => {
    const style = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(drag.value, range, [1, 0], Extrapolation.CLAMP) }],
        opacity: interpolate(drag.value, range, [1, 0], Extrapolation.CLAMP),
    }));
    return (
        <Pressable style={styles.btn} onPress={onPress}>
            <Reanimated.View style={style}><Icon name={icon} size={24} color={color} /></Reanimated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: { overflow: 'visible' },
    rightActions: { flexDirection: 'row', width: 100, justifyContent: 'flex-end' },
    btn: { width: 50, justifyContent: 'center', alignItems: 'center' },
});