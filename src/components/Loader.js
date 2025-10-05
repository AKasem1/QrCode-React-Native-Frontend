import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../styles/theme';

const Loader = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primary]}
      style={styles.container}
    >
      <ActivityIndicator size={size} color={colors.white} />
      {message && <Text style={styles.message}>{message}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Loader;
