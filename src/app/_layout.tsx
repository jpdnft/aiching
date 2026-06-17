import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#111317' : '#f6f1e8';
  const tintColor = isDark ? '#e9c46a' : '#7c4f18';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tintColor,
          tabBarInactiveTintColor: isDark ? '#8b918f' : '#7b7468',
          tabBarStyle: {
            backgroundColor,
            borderTopColor: isDark ? '#2b2f35' : '#ddd0bd',
          },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Cast' }} />
        <Tabs.Screen name="reading" options={{ title: 'Reading' }} />
        <Tabs.Screen name="history" options={{ title: 'History' }} />
        <Tabs.Screen name="guide" options={{ title: 'Guide' }} />
        <Tabs.Screen name="future" options={{ title: 'Future' }} />
      </Tabs>
    </ThemeProvider>
  );
}
