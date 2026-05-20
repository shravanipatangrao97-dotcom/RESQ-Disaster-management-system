import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Map, AlertTriangle, Home, FileWarning, CloudLightning } from 'lucide-react-native';
import { colors, fonts } from '../theme';

// Placeholder screens
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={styles.placeholder}>
    <Text style={{ color: colors.textPrimary, fontFamily: fonts.bebas, fontSize: 32 }}>
      {name}
    </Text>
  </View>
);

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case 'MAP':
                return <Map color={color} size={24} />;
              case 'ALERTS':
                return <AlertTriangle color={color} size={24} />;
              case 'SHELTERS':
                return <Home color={color} size={24} />;
              case 'REPORT':
                return <FileWarning color={color} size={24} />;
              case 'WEATHER':
                return <CloudLightning color={color} size={24} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="MAP" children={() => <PlaceholderScreen name="MAP SCREEN" />} />
        <Tab.Screen name="ALERTS" children={() => <PlaceholderScreen name="ALERTS SCREEN" />} />
        <Tab.Screen name="SHELTERS" children={() => <PlaceholderScreen name="SHELTERS SCREEN" />} />
        <Tab.Screen name="REPORT" children={() => <PlaceholderScreen name="REPORT SCREEN" />} />
        <Tab.Screen name="WEATHER" children={() => <PlaceholderScreen name="WEATHER SCREEN" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.primary,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
