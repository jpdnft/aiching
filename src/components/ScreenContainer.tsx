import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/appTheme';
import { getAiChingColors } from '@/theme/colors';

type Props = PropsWithChildren<{
  scroll?: boolean;
  themeAware?: boolean;
}>;

export function ScreenContainer({ children, scroll = true, themeAware = false }: Props) {
  const { colorMode } = useAppTheme();
  const colors = getAiChingColors(themeAware ? colorMode : 'dark');
  const backgroundStyle = { backgroundColor: colors.ink };

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
        <View style={[styles.content, backgroundStyle]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
      <ScrollView style={backgroundStyle} contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 112,
  },
});
