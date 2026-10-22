import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { THEME } from '../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

// Prevent native splash screen from hiding prematurely
ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Start at opacity 1 so it is 100% opaque from frame 0 - no flash of app content!
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide native splash now that custom animated splash screen has mounted
    ExpoSplashScreen.hideAsync().catch(() => {});

    // Subtle scale entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: false,
    }).start(() => {
      // Smooth fade out to reveal main app
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.55],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="box-only">
      <StatusBar style="light" />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
        {/* Official Exness Black Circle with Yellow 'ex' */}
        <View style={styles.exLogoCircle}>
          <Text style={styles.exLogoText}>ex</Text>
        </View>

        {/* Brand Text */}
        <Text style={styles.brandTitle}>EXNESS</Text>
        <Text style={styles.brandSub}>PRO TRADER</Text>
      </Animated.View>

      {/* Bottom Loading Indicator & Tagline */}
      <View style={styles.bottomContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>

        <Text style={styles.serverStatus}>Connecting to Exness Real-Time Feed...</Text>
        <Text style={styles.tagline}>BORN TO TRADE · INSTANT WITHDRAWALS</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 70,
    zIndex: 99999,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exLogoCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFDE00',
    shadowColor: '#FFDE00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 20,
  },
  exLogoText: {
    color: '#FFDE00',
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: -4,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
  },
  brandSub: {
    color: '#FFDE00',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 4,
  },
  bottomContainer: {
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    width: width * 0.55,
    height: 3,
    backgroundColor: '#222630',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFDE00',
  },
  serverStatus: {
    color: '#8A92A6',
    fontSize: 11,
    fontWeight: '500',
  },
  tagline: {
    color: '#555E70',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
