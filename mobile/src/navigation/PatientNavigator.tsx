import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { DashboardScreen } from '../screens/patient/DashboardScreen';
import { HealthHistoryScreen } from '../screens/patient/HealthHistoryScreen';
import { ManualEntryScreen } from '../screens/patient/ManualEntryScreen';
import { DocumentUploadScreen } from '../screens/patient/DocumentUploadScreen';
import { EHRImportScreen } from '../screens/patient/EHRImportScreen';
import { SymptomInputScreen } from '../screens/patient/SymptomInputScreen';
import { HealthServiceLocatorScreen } from '../screens/patient/HealthServiceLocatorScreen';
import { ProfileScreen } from '../screens/patient/ProfileScreen';
import { CustomTabBar } from '../components/common/CustomTabBar';
import { RecordsHubScreen } from '../screens/patient/RecordsHubScreen';
 
const Tab = createBottomTabNavigator();
const RecordsStack = createStackNavigator();
const SymptomStack = createStackNavigator();
 
const RecordsNavigator = () => (
  <RecordsStack.Navigator screenOptions={{ headerShown: false }}>
    <RecordsStack.Screen name="RecordsHub" component={RecordsHubScreen} />
    <RecordsStack.Screen name="HealthHistory" component={HealthHistoryScreen} />
    <RecordsStack.Screen name="ManualEntry" component={ManualEntryScreen} />
    <RecordsStack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
    <RecordsStack.Screen name="EHRImport" component={EHRImportScreen} />
  </RecordsStack.Navigator>
);

const SymptomNavigator = () => (
  <SymptomStack.Navigator screenOptions={{ headerShown: false }}>
    <SymptomStack.Screen name="SymptomInput" component={SymptomInputScreen} />
  </SymptomStack.Navigator>
);

const TAB_ROUTES = [
  { key: 'Dashboard', name: 'Dashboard', icon: 'grid-outline' as const, iconFocused: 'grid' as const, label: 'Home' },
  { key: 'Records', name: 'Records', icon: 'calendar-outline' as const, iconFocused: 'calendar' as const, label: 'Records' },
  { key: 'Symptoms', name: 'Symptoms', icon: 'pulse-outline' as const, iconFocused: 'pulse' as const, label: 'Symptoms' },
  { key: 'Locator', name: 'Locator', icon: 'location-outline' as const, iconFocused: 'location' as const, label: 'Locator' },
  { key: 'Profile', name: 'Profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
];

export const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} tabRoutes={TAB_ROUTES} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Records" component={RecordsNavigator} />
      <Tab.Screen name="Symptoms" component={SymptomNavigator} />
      <Tab.Screen name="Locator" component={HealthServiceLocatorScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};