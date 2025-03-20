import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { checkConnection, supabase } from '../config/supabase';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean;
    success?: boolean;
    error?: any;
  }>({ checked: false });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await checkConnection();
      setConnectionStatus({ 
        checked: true, 
        success: result.success,
        error: result.error
      });
    } catch (error) {
      setConnectionStatus({ 
        checked: true, 
        success: false,
        error
      });
    }
  };

  if (!connectionStatus.checked) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Checking database connection...</Text>
      </View>
    );
  }

  if (!connectionStatus.success) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Database connection error</Text>
        <Text style={styles.errorDetails}>
          {connectionStatus.error?.message || 'Unknown error'}
        </Text>
        <Button mode="contained" onPress={testConnection} style={styles.button}>
          Retry Connection
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="exam/session" 
          options={{ 
            title: 'Exam Session',
            headerBackVisible: false,
          }} 
        />
        <Stack.Screen 
          name="exam/results" 
          options={{ 
            title: 'Exam Results',
            headerBackVisible: false,
          }} 
        />
        <Stack.Screen 
          name="learn/question/[id]" 
          options={{ 
            title: 'Question Details',
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  }
}); 