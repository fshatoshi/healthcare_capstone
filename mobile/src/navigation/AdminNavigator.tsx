import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { AIModuleConfigScreen } from '../screens/admin/AIModuleConfigScreen';
import { AdminSettingsScreen } from '../screens/admin/AdminSettingsScreen';
import { CustomTabBar } from '../components/common/CustomTabBar';

const Tab = createBottomTabNavigator();

const TAB_ROUTES = [
  { key: 'Dashboard', name: 'Dashboard', icon: 'grid-outline' as const, iconFocused: 'grid' as const, label: 'Panel' },
  { key: 'Users', name: 'Users', icon: 'people-outline' as const, iconFocused: 'people' as const, label: 'Users' },
  { key: 'AIModules', name: 'AIModules', icon: 'cube-outline' as const, iconFocused: 'cube' as const, label: 'AI' },
  { key: 'Settings', name: 'Settings', icon: 'settings-outline' as const, iconFocused: 'settings' as const, label: 'Settings' },
];

export const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} tabRoutes={TAB_ROUTES} />}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Users" component={UserManagementScreen} />
      <Tab.Screen name="AIModules" component={AIModuleConfigScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
};