import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { resetPassword } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email, code } = route.params;
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    setApiError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email, code, password);
    setIsLoading(false);

    if (result.success) {
      if (result.data.token && result.data.user) {
        await login(email, password);
      }
    } else {
      setApiError(result.error);
    }
  };

  return (
    <LinearGradient
      colors={[colors.accent, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>🔑</Text>
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.subtitle}>
              Create a strong password for your account
            </Text>
          </View>

          <View style={styles.formCard}>
            {apiError ? <ErrorMessage message={apiError} type="error" /> : null}

            <Input
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              loading={isLoading}
              variant="secondary"
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.offWhite,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.large,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default ResetPasswordScreen;
