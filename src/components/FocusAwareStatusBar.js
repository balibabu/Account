import * as React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const FocusAwareStatusBar = (props) => {
  const isFocused = useIsFocused();

  // If the screen is focused, render the StatusBar with props.
  // If not focused, return null so it doesn't fight with other screens.
  return isFocused ? <StatusBar {...props} /> : null;
};

export default FocusAwareStatusBar;