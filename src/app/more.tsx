import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const links = [
  {
    title: 'What Is the I Ching?',
    body: 'A brief historical and practical introduction to the Book of Changes.',
    href: '/what-is-iching',
    avatar: require('@/assets/hexagrams/themes/02/52.jpg'),
  },
  {
    title: 'Browse Hexagrams',
    body: 'Explore the 64 hexagrams and their themes.',
    href: '/browse-hexagrams',
    avatar: require('@/assets/hexagrams/themes/01/river_hermit.jpg'),
  },
  {
    title: 'User Guide',
    body: 'Learn how casting works, why lines build upward, and how to frame readings.',
    href: '/guide',
    avatar: require('@/assets/hexagrams/themes/03/weathered_sage.jpg'),
  },
  {
    title: 'Settings',
    body: 'Theme selection, reading preferences, and controls will live here.',
    href: '/settings',
    avatar: require('@/assets/hexagrams/themes/02/garden_monk.jpg'),
  },
  {
    title: 'Manage Version',
    body: 'Select and manage your version of this app.',
    href: '/version',
    avatar: require('@/assets/hexagrams/themes/01/lantern_oracle.jpg'),
  },
  {
    title: 'Sample Premium Reading',
    body: 'See a real Premium reading generated around a custom question.',
    href: '/sample',
    avatar: require('@/assets/hexagrams/themes/03/weathered_sage.jpg'),
  },
  {
    title: 'Data & Privacy',
    body: 'How Premium questions and reading data are handled.',
    href: '/data-policy',
    avatar: require('@/assets/hexagrams/themes/01/dream_librarian.jpg'),
  },
  {
    title: 'Future',
    body: 'Preview possible additions like themes, journaling, deeper readings, and feedback.',
    href: '/future',
    avatar: require('@/assets/hexagrams/themes/02/star_cartographer.jpg'),
  },
  {
    title: 'About the Developer',
    body: "Need a website, app, or other coded gizmo? Here's Jim's info.",
    href: '/about',
    avatar: require('@/assets/hexagrams/themes/03/tea_house_auntie.jpg'),
  },
  {
    title: 'Reviewer Access',
    body: 'Sign in as a reviewer with the access details supplied for app review.',
    href: '/review-access',
    avatar: require('@/assets/hexagrams/themes/03/lantern_oracle.jpg'),
  },
] as const;

export default function MoreScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>More</Text>
      <Text style={styles.intro}>Settings, guidance, and what may come next.</Text>

      <View style={styles.list}>
        {links.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <Image source={link.avatar} style={styles.avatar} contentFit="cover" />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{link.title}</Text>
              <Text style={styles.rowBody}>{link.body}</Text>
            </View>
            <Text style={styles.chevron}>{'>'}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
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
  list: {
    gap: 12,
  },
  row: {
    minHeight: 92,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: 'rgba(219, 226, 223, 0.08)',
  },
  rowPressed: {
    opacity: 0.78,
  },
  rowText: {
    flex: 1,
    gap: 6,
  },
  rowTitle: {
    color: aiChingColors.mist,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  rowBody: {
    color: aiChingColors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  chevron: {
    color: aiChingColors.gold,
    fontSize: 32,
    lineHeight: 36,
  },
});
