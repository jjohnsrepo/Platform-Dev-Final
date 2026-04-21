import { Amplify } from 'aws-amplify';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { BooksProvider } from '@/context/BooksContext';
import { Colors } from '@/constants/theme';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID ?? '',
      userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID ?? '',
    },
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <BooksProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="createAccount" />
          <Stack.Screen name="library" />
          <Stack.Screen
            name="scanner"
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="book/[isbn]" />
        </Stack>
      </BooksProvider>
    </AuthProvider>
  );
}
