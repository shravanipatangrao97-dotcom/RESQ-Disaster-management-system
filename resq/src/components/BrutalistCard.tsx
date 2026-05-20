import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface BrutalistCardProps extends ViewProps {
  glowColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderLeftWidth?: number;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({ 
  style, 
  glowColor,
  borderColor = colors.border,
  borderWidth = 1,
  borderLeftWidth,
  children,
  ...props 
}) => {
  const glowStyle = glowColor ? {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  } : {};

  return (
    <View 
      style={[
        styles.card, 
        glowStyle,
        { 
          borderColor, 
          borderWidth,
          borderLeftWidth: borderLeftWidth !== undefined ? borderLeftWidth : borderWidth,
        },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
