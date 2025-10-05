import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { getCurrentQR, refreshQR } from '../utils/api';
import { APP_CONFIG } from '../utils/config';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const [qrData, setQrData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fetchNewQRCode = async () => {
    try {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const result = await refreshQR();
      
      if (result.success) {
        setTimeout(() => {
          setQrData(result.data.uuid || result.data.qrCode || result.data);
          setError('');
          setCountdown(60);
          
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 300);
      } else {
        setError(result.error);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (err) {
      setError('Failed to load QR code');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const result = await refreshQR();
    
    if (result.success) {
      setTimeout(() => {
        setQrData(result.data.uuid || result.data.qrCode || result.data);
        setError('');
        setCountdown(60);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 300);
    } else {
      setError(result.error);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const result = await getCurrentQR();
        if (result.success) {
          setQrData(result.data.uuid || result.data.qrCode || result.data);
          setError('');
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load QR code');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();

    intervalRef.current = setInterval(() => {
      fetchNewQRCode();
    }, APP_CONFIG.QR_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return <Loader message="Loading QR Code..." />;
  }

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <ErrorMessage message={error} onRetry={fetchNewQRCode} type="error" />
        ) : null}

        {/* QR Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <Text style={styles.qrTitle}>Your QR Code</Text>
          </View>

          {qrData ? (
            <Animated.View style={[styles.qrWrapper, { opacity: fadeAnim }]}>
              <View style={styles.qrContainer}>
                <QRCode
                  value={qrData}
                  size={220}
                  backgroundColor="white"
                  color={colors.primary}
                />
              </View>
            </Animated.View>
          ) : (
            <Text style={styles.noDataText}>No QR code available</Text>
          )}

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Next refresh in</Text>
              <Text style={styles.countdownValue}>{countdown}s</Text>
            </View>
            
            <View style={styles.uuidContainer}>
              <Text style={styles.uuidLabel}>UUID</Text>
              <Text style={styles.uuidText} numberOfLines={1} ellipsizeMode="middle">
                {qrData}
              </Text>
            </View>
          </View>

          <Button
            title="Refresh Now"
            onPress={handleManualRefresh}
            loading={isRefreshing}
            variant="secondary"
            style={styles.refreshButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  greeting: {
    fontSize: 16,
    color: colors.offWhite,
    fontWeight: '400',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  logoutButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.large,
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.black,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  qrWrapper: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  qrContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: colors.primaryLight,
    ...shadows.medium,
  },
  noDataText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    padding: spacing.xl,
  },
  infoSection: {
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  countdownLabel: {
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  countdownValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.accent,
  },
  uuidContainer: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  uuidLabel: {
    fontSize: 12,
    color: colors.darkGray,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  uuidText: {
    fontSize: 11,
    color: colors.black,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '500',
  },
  refreshButton: {
    marginTop: spacing.md,
  },
});

export default HomeScreen;
