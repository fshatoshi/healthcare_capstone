import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { DoctorDashboardScreen } from '../screens/doctor/DoctorDashboardScreen';
import { DoctorPatientDetailScreen } from '../screens/doctor/DoctorPatientDetailScreen';
import { PatientFileScreen } from '../screens/doctor/PatientFileScreen';
import { AIReviewScreen } from '../screens/doctor/AIReviewScreen';
import { DoctorProfileScreen } from '../screens/doctor/DoctorProfileScreen';
import { CustomTabBar } from '../components/common/CustomTabBar';

const Tab = createBottomTabNavigator();
const PatientStack = createStackNavigator();

const PatientNavigator = () => (
  <PatientStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DoctorDashboard">
    <PatientStack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
    <PatientStack.Screen name="PatientDetail" component={DoctorPatientDetailScreen} />
    <PatientStack.Screen name="PatientFile" component={PatientFileScreen} />
    <PatientStack.Screen name="AIReview" component={AIReviewScreen} />
  </PatientStack.Navigator>
);

const TAB_ROUTES = [
  { key: 'Patients', name: 'Patients', icon: 'people-outline' as const, iconFocused: 'people' as const, label: 'Patients' },
  { key: 'Alerts', name: 'Alerts', icon: 'notifications-outline' as const, iconFocused: 'notifications' as const, label: 'Alerts' },
  { key: 'Profile', name: 'Profile', icon: 'person-outline' as const, iconFocused: 'person' as const, label: 'Profile' },
  { key: 'Settings', name: 'Settings', icon: 'settings-outline' as const, iconFocused: 'settings' as const, label: 'Settings' },
];

// Placeholder for Alerts and Settings tabs (reusing screens for demo)
export const DoctorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} tabRoutes={TAB_ROUTES} />}
    >
      <Tab.Screen name="Patients" component={PatientNavigator} />
      <Tab.Screen name="Alerts" component={DoctorHomeScreen} />
      <Tab.Screen name="Profile" component={DoctorProfileScreen} />
      <Tab.Screen name="Settings" component={DoctorProfileScreen} />
    </Tab.Navigator>
  );
};