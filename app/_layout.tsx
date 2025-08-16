import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor="transparent"
        translucent
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#1f2937',
          headerTitleStyle: {
            fontWeight: '600',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Hayat Çizgisi',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="character-creation" 
          options={{ 
            title: 'Karakter Oluştur',
            presentation: 'modal',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="game" 
          options={{ 
            title: 'Oyun',
            headerShown: false,
            gestureEnabled: false
          }} 
        />
      </Stack>
    </>
  );
}
