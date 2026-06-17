import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { aiChingColors } from '@/theme/colors';
import { hexagramThemeList, HexagramThemeManifest } from '@/theme/hexagramBackgrounds';

export default function SettingsScreen() {
  const { themeId, setThemeId } = useAppTheme();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.intro}>
        Choose the visual theme used for casting, readings, and history.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeList}>
          {hexagramThemeList.map((theme) => (
            <ThemeOption
              key={theme.id}
              theme={theme}
              selected={theme.id === themeId}
              onPress={() => setThemeId(theme.id)}
            />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

function ThemeOption({
  theme,
  selected,
  onPress,
}: {
  theme: HexagramThemeManifest;
  selected: boolean;
  onPress: () => void;
}) {
  const disabled = !theme.isAvailable;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeOption,
        selected && styles.themeOptionSelected,
        disabled && styles.themeOptionDisabled,
        pressed && !disabled && styles.themeOptionPressed,
      ]}>
      <View style={styles.themeText}>
        <Text style={styles.themeName}>{theme.name}</Text>
        <Text style={styles.themeMeta}>{theme.description}</Text>
      </View>
      <Text style={[styles.themeState, selected && styles.themeStateSelected]}>
        {selected ? 'Selected' : disabled ? 'Locked' : 'Select'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: aiChingColors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 24,
  },
  section: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 14,
  },
  sectionTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  themeList: {
    gap: 10,
  },
  themeOption: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: 'rgba(16, 19, 24, 0.52)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeOptionSelected: {
    borderColor: 'rgba(231, 197, 111, 0.72)',
  },
  themeOptionDisabled: {
    opacity: 0.52,
  },
  themeOptionPressed: {
    opacity: 0.78,
  },
  themeText: {
    flex: 1,
    gap: 4,
  },
  themeName: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  themeMeta: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  themeState: {
    color: aiChingColors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  themeStateSelected: {
    color: aiChingColors.gold,
  },
});
