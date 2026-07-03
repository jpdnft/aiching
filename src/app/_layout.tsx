import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { ColorValue, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopAdBanner } from '@/components/TopAdBanner';
import { configureDailyReminderNotificationHandler } from '@/services/dailyReminders';
import { AppThemeProvider, useAppTheme } from '@/theme/appTheme';
import { getAiChingColors } from '@/theme/colors';

type TabSymbol = SymbolViewProps['name'];

configureDailyReminderNotificationHandler();

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <AppTabs />
    </AppThemeProvider>
  );
}

function AppTabs() {
  const { colorMode, entitlements } = useAppTheme();
  const colors = getAiChingColors(colorMode);
  const isDark = colorMode === 'dark';
  const backgroundColor = isDark ? 'rgba(17, 19, 23, 0.96)' : 'rgba(255, 250, 240, 0.96)';
  const activeTintColor = isDark ? colors.gold : colors.goldDeep;
  const inactiveTintColor = isDark ? '#8b918f' : '#7b7468';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={[styles.appShell, { backgroundColor: colors.ink }]}>
        {entitlements.adsEnabled ? <TopAdBannerSlot backgroundColor={colors.ink} /> : null}
        <View style={styles.tabsShell}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: activeTintColor,
              tabBarInactiveTintColor: inactiveTintColor,
              tabBarLabelStyle: styles.tabLabel,
              tabBarStyle: {
                backgroundColor,
                borderTopColor: isDark ? 'rgba(231, 197, 111, 0.22)' : 'rgba(95, 58, 15, 0.2)',
                borderTopWidth: 1,
                height: 78,
                paddingTop: 8,
                paddingBottom: 10,
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                position: 'absolute',
                overflow: 'hidden',
              },
            }}>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Cast',
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    color={color}
                    focused={focused}
                    name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="reading"
              options={{
                href: entitlements.aiReadingsEnabled ? '/reading-premium' : '/reading',
                title: 'Reading',
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    color={color}
                    focused={focused}
                    name={{ ios: 'book.pages', android: 'menu_book', web: 'menu_book' }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="history"
              options={{
                title: 'History',
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    color={color}
                    focused={focused}
                    name={{ ios: 'clock.arrow.circlepath', android: 'history', web: 'history' }}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="more"
              options={{
                title: 'More',
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    color={color}
                    focused={focused}
                    name={{ ios: 'gearshape', android: 'settings', web: 'settings' }}
                  />
                ),
              }}
            />
            <Tabs.Screen name="settings" options={{ href: null }} />
            <Tabs.Screen name="guide" options={{ href: null }} />
            <Tabs.Screen name="browse-hexagrams" options={{ href: null }} />
            <Tabs.Screen name="hexagram" options={{ href: null }} />
            <Tabs.Screen name="future" options={{ href: null }} />
            <Tabs.Screen name="about" options={{ href: null }} />
            <Tabs.Screen name="data-policy" options={{ href: null }} />
            <Tabs.Screen name="version" options={{ href: null }} />
            <Tabs.Screen name="review-access" options={{ href: null }} />
            <Tabs.Screen name="sample" options={{ href: null }} />
            <Tabs.Screen name="daily-reminders" options={{ href: null }} />
            <Tabs.Screen name="reading-premium" options={{ href: null }} />
            <Tabs.Screen name="what-is-iching" options={{ href: null }} />
          </Tabs>
        </View>
      </View>
    </ThemeProvider>
  );
}

function TopAdBannerSlot({ backgroundColor }: { backgroundColor: string }) {
  return (
    <SafeAreaView edges={['top']} style={[styles.adSafeArea, { backgroundColor }]}>
      <TopAdBanner />
    </SafeAreaView>
  );
}

function TabIcon({
  color,
  focused,
  name,
}: {
  color: ColorValue;
  focused: boolean;
  name: TabSymbol;
}) {
  return (
    <View style={[styles.iconShell, focused && styles.iconShellActive]}>
      <SymbolView name={name} tintColor={color} size={22} weight="semibold" type="hierarchical" />
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
  },
  tabsShell: {
    flex: 1,
  },
  adSafeArea: {
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  iconShell: {
    width: 38,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShellActive: {
    backgroundColor: 'rgba(231, 197, 111, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.34)',
  },
});
