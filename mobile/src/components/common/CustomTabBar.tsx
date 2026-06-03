import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

interface TabBarRoute {
  key: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  tabRoutes: TabBarRoute[];
}

const TabBarItem: React.FC<{
  route: TabBarRoute;
  focused: boolean;
  onPress: () => void;
}> = ({ route, focused, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          speed: 30,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 20,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.timing(dotAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(dotAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  }, [focused]);

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={focused ? route.iconFocused : route.icon}
          size={24}
          color={focused ? colors.tabActive : colors.tabInactive}
        />
      </Animated.View>
      {focused && (
        <Text style={styles.tabLabel}>{route.label}</Text>
      )}
      <Animated.View style={[styles.tabDot, { opacity: dotAnim }]} />
    </TouchableOpacity>
  );
};

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation, tabRoutes }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const tabRoute = tabRoutes[index];

          return (
            <TabBarItem
              key={route.key}
              route={tabRoute}
              focused={focused}
              onPress={() => {
                if (!focused) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.tabBg,
    borderTopWidth: 1,
    borderTopColor: '#1A9B6C33',
  },
  bar: {
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 3,
  },
  tabLabel: {
    ...typography.bodyXSmall,
    color: colors.tabActive,
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.gold,
    position: 'absolute',
    bottom: 0,
  },
});
