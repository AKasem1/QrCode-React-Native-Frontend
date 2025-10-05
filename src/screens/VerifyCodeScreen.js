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
import { verifyResetCode } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const VerifyCodeScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateCode = () => {
    if (!code.trim()) {
      setError('Verification code is required');
      return false;
    }
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Code must be 6 digits');
      return false;
    }
    return true;
  };

  const handleVerifyCode = async () => {
    setError('');
    
    if (!validateCode()) {
      return;
    }

    setIsLoading(true);
    const result = await verifyResetCode(email, code);
    setIsLoading(false);

    if (result.success) {
      navigation.navigate('ResetPassword', { email, code });
    } else {
      setError(result.error);
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
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
            <Text style={styles.emoji}>📧</Text>
            <Text style={styles.title}>Enter Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>
          </View>

          <View style={styles.formCard}>
            {error ? <ErrorMessage message={error} type="error" /> : null}

            <Input
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
            />

            <Button
              title="Verify Code"
              onPress={handleVerifyCode}
              loading={isLoading}
              style={styles.button}
            />

            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
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
  email: {
    fontWeight: '700',
    color: colors.white,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.large,
  },
  button: {
    marginBottom: spacing.md,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});

export default VerifyCodeScreen;
