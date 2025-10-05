import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing } from '../styles/theme';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  type = 'error' 
}) => {
  const getColors = () => {
    switch (type) {
      case 'error':
        return { bg: '#FFE5E5', text: colors.error, border: colors.error };
      case 'warning':
        return { bg: '#FFF3E0', text: colors.warning, border: colors.warning };
      case 'info':
        return { bg: '#E3F2FD', text: colors.info, border: colors.info };
      case 'success':
        return { bg: '#E8F5E9', text: colors.success, border: colors.success };
      default:
        return { bg: '#FFE5E5', text: colors.error, border: colors.error };
    }
  };

  const colorScheme = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colorScheme.bg, borderLeftColor: colorScheme.border }]}>
      <Text style={[styles.message, { color: colorScheme.text }]}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { borderColor: colorScheme.border }]} 
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: colorScheme.text }]}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    borderLeftWidth: 4,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    alignSelf: 'center',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorMessage;
