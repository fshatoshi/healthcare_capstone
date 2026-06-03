import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { PatientNavigator } from './PatientNavigator';
import { DoctorNavigator } from './DoctorNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { role } = useAppSelector((state) => state.auth);

  switch (role) {
    case 'DOCTOR':
      return <DoctorNavigator />;
    case 'ADMIN':
      return <AdminNavigator />;
    case 'PATIENT':
    default:
      return <PatientNavigator />;
  }
};

export const AppNavigator = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Splash screen is always first */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {!isAuth ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};