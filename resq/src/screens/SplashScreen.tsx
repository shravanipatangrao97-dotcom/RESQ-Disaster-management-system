import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { BebasHeading } from '../components/BebasHeading';
import { TerminalText } from '../components/TerminalText';
import { ScanlineOverlay } from '../components/ScanlineOverlay';

export const SplashScreen = ({ onEnter }: { onEnter: () => void }) => {
  const [bootLines, setBootLines] = useState<number>(0);
  const rotation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer1 = setTimeout(() => setBootLines(1), 400);
    const timer2 = setTimeout(() => setBootLines(2), 800);
    const timer3 = setTimeout(() => setBootLines(3), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <ScanlineOverlay />
      
      <View style={styles.center}>
        {/* Radar Simulation */}
        <View style={styles.radarContainer}>
          <View style={[styles.radarCircle, styles.circle1]} />
          <View style={[styles.radarCircle, styles.circle2]} />
          <View style={[styles.radarCircle, styles.circle3]} />
          <View style={[styles.radarCircle, styles.circle4]} />
          <Animated.View style={[styles.radarSweep, { transform: [{ rotate: spin }] }]} />
        </View>

        <BebasHeading size={72} spacing={4} style={styles.title}>RESQ</BebasHeading>
        <TerminalText color="rgba(0, 230, 118, 0.5)" size={10} style={{ marginBottom: 40 }}>
          DISASTER RESPONSE SYSTEM v1.0
        </TerminalText>

        <View style={styles.bootConsole}>
          {bootLines >= 1 && <TerminalText size={12}>{'> LOCATING GPS SIGNAL........OK'}</TerminalText>}
          {bootLines >= 2 && <TerminalText size={12}>{'> LOADING ZONE DATABASE.....OK'}</TerminalText>}
          {bootLines >= 3 && <TerminalText size={12}>{'> CONNECTING TO NDRF NET....OK'}</TerminalText>}
        </View>

        {bootLines >= 3 && (
          <TouchableOpacity style={styles.enterButton} onPress={onEnter} activeOpacity={0.8}>
            <BebasHeading size={24} style={styles.enterText}>ENTER RESQ</BebasHeading>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TerminalText color={colors.textPrimary} size={10}>
          2,847 ACTIVE USERS · 3 CRITICAL ALERTS_
        </TerminalText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure black screen requested
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
    zIndex: 20,
  },
  radarContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  radarCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 1000,
  },
  circle1: { width: 50, height: 50 },
  circle2: { width: 100, height: 100 },
  circle3: { width: 150, height: 150 },
  circle4: { width: 200, height: 200 },
  radarSweep: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.safe,
    borderTopRightRadius: 100,
    top: 0,
    right: 0,
    opacity: 0.8,
  },
  title: {
    marginBottom: 8,
  },
  bootConsole: {
    width: '100%',
    height: 80,
    justifyContent: 'flex-start',
    marginBottom: 40,
  },
  enterButton: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0, // Sharp corners
  },
  enterText: {
    color: '#FFF',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    zIndex: 20,
  }
});
