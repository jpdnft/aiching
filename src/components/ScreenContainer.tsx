import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { aiChingColors } from '@/theme/colors';

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function ScreenContainer({ children, scroll = true }: Props) {
  if (!scroll) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: aiChingColors.ink,
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
