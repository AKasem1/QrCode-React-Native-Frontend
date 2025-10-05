import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows } from '../styles/theme';

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  style = {}
}) => {
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[styles.button, styles.buttonOutline, (disabled || loading) && styles.buttonDisabled, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.textOutline}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  const gradientColors = variant === 'secondary' 
    ? [colors.accent, colors.accentDark]
    : [colors.primary, colors.primaryDark];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[style]}
    >
      <LinearGradient
        colors={disabled || loading ? [colors.gray, colors.darkGray] : gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, styles.gradientButton]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  gradientButton: {
    ...shadows.small,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textOutline: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
