import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface BebasHeadingProps extends TextProps {
  color?: string;
  size?: number;
  spacing?: number;
}

export const BebasHeading: React.FC<BebasHeadingProps> = ({ 
  style, 
  color = colors.textPrimary, 
  size = 24,
  spacing = 1,
  children,
  ...props 
}) => {
  return (
    <Text 
      style={[
        styles.text, 
        { 
          color, 
          fontSize: size, 
          letterSpacing: spacing,
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.bebas,
  },
});
