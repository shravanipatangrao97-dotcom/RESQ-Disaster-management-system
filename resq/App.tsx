import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';
import { BarlowCondensed_500Medium } from '@expo-google-fonts/barlow-condensed';
import { SplashScreen } from './src/screens/SplashScreen';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        BebasNeue_400Regular,
        ShareTechMono_400Regular,
        BarlowCondensed_500Medium,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00E676" size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {showSplash ? (
        <SplashScreen onEnter={() => setShowSplash(false)} />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#050508' }}>
          <RootNavigator />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

