import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface TerminalTextProps extends TextProps {
  color?: string;
  size?: number;
  spacing?: number;
}

export const TerminalText: React.FC<TerminalTextProps> = ({ 
  style, 
  color = colors.textData, 
  size = 10,
  spacing = 3,
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
    fontFamily: fonts.mono,
    textTransform: 'uppercase',
  },
});
