import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../styles/theme';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>QR Auth App</Text>
      <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
      <Text style={styles.subtitle}>Loading your experience...</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.md,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: colors.offWhite,
    fontWeight: '400',
  },
});

export default SplashScreen;
