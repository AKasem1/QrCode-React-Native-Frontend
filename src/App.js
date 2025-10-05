import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, Platform } from 'react-native'; 
import { AuthProvider } from './context/AuthContext';
import { useAxiosInterceptor } from './utils/useAxiosInterceptor';
import RootNavigator from './navigation/RootNavigator';

function AppContent() {
  useAxiosInterceptor();
  
  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
