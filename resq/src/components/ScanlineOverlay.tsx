import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const linesCount = Math.floor(height / 4);

export const ScanlineOverlay: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: linesCount }).map((_, i) => (
        <View key={i} style={styles.line} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10,
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
});
