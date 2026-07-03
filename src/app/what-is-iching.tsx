import { ReactNode } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

const aboutIChingImage = require('@/assets/images/aboutiching.jpg');

const historyTimeline = [
  'Legendary age: Fu Xi and the eight trigrams',
  'Early Zhou period: the core divination text takes shape',
  'Later Zhou / Warring States: deeper interpretation develops',
  'Han dynasty: the I Ching becomes one of the Confucian Five Classics',
  'Modern era: translations spread it worldwide, including the Wilhelm/Baynes edition',
];

const trigrams = [
  { name: 'Qian', force: 'Heaven', meaning: 'Creative, strong, active', lines: ['yang', 'yang', 'yang'] },
  { name: 'Kun', force: 'Earth', meaning: 'Receptive, yielding, supportive', lines: ['yin', 'yin', 'yin'] },
  { name: 'Zhen', force: 'Thunder', meaning: 'Arousing, sudden movement', lines: ['yin', 'yin', 'yang'] },
  { name: 'Xun', force: 'Wind', meaning: 'Gentle, penetrating, gradual', lines: ['yang', 'yang', 'yin'] },
  { name: 'Kan', force: 'Water', meaning: 'Depth, danger, flow', lines: ['yin', 'yang', 'yin'] },
  { name: 'Li', force: 'Fire', meaning: 'Clarity, brightness, awareness', lines: ['yang', 'yin', 'yang'] },
  { name: 'Gen', force: 'Mountain', meaning: 'Stillness, stopping, meditation', lines: ['yang', 'yin', 'yin'] },
  { name: 'Dui', force: 'Lake', meaning: 'Joy, openness, exchange', lines: ['yin', 'yang', 'yang'] },
];

export default function WhatIsIChingScreen() {
  const router = useRouter();
  const styles = useWhatIsIChingStyles();

  return (
    <ScreenContainer themeAware>
      <Text style={styles.kicker}>Background</Text>
      <Image
        source={aboutIChingImage}
        style={styles.heroImage}
        contentFit="cover"
        accessibilityLabel="Illustration introducing the I Ching"
      />
      <Text style={styles.title}>What Is the I Ching?</Text>
      <Text style={styles.intro}>
        The I Ching, also called the Yijing or Book of Changes, is one of the oldest and most
        influential classics of Chinese culture.
      </Text>

      <View style={styles.callout}>
        <Text style={styles.calloutText}>
          For thousands of years, people have used it as an oracle: a way to reflect on questions,
          choices, relationships, timing, and change.
        </Text>
      </View>

      <ArticleSection title="A Mirror for Change">
        <Text style={styles.body}>
          The I Ching is not fortune-telling in the simple sense of predicting a fixed future. It
          works more like a mirror. A reading offers symbols, images, and advice that help you look
          more clearly at a situation.
        </Text>
        <Text style={styles.body}>
          It may point to hidden tensions, useful timing, needed patience, or a better way to act.
          The book has two lives: it is a practical divination text used by people seeking guidance,
          and it is also a profound philosophical work about change, balance, nature, and human
          conduct.
        </Text>
        <Text style={styles.body}>
          At its heart is a simple but powerful idea: life is always changing. Wisdom begins by
          understanding the pattern of the moment.
        </Text>
      </ArticleSection>

      <ArticleSection title="A Brief History">
        <Text style={styles.body}>
          The origins of the I Ching are ancient, layered, and partly legendary. Traditional stories
          connect it with Fu Xi, King Wen of Zhou, and the Duke of Zhou.
        </Text>
        <Text style={styles.body}>
          Modern scholarship treats these as important cultural traditions rather than simple
          historical facts. The oldest layer, often called the Zhouyi or Changes of Zhou, likely
          began as a divination manual during the early Zhou period, around the early first
          millennium BCE.
        </Text>
        <Text style={styles.body}>
          Later, during the Warring States and Han periods, philosophical commentaries known as the
          Ten Wings helped transform the I Ching from a practical oracle into a major work of
          cosmology, ethics, and philosophy.
        </Text>
        <View style={styles.list}>
          {historyTimeline.map((item) => (
            <Bullet key={item}>{item}</Bullet>
          ))}
        </View>
      </ArticleSection>

      <ArticleSection title="Yin, Yang, and Timing">
        <Text style={styles.body}>
          The I Ching is built from two kinds of lines. Yang is solid: active, firm, bright,
          creative, and moving outward. Yin is broken: receptive, yielding, dark, nourishing, and
          moving inward.
        </Text>
        <Text style={styles.body}>
          These are not enemies. They are complementary forces. Day turns into night. Winter turns
          toward spring. Action needs rest. Strength needs flexibility.
        </Text>
        <Text style={styles.body}>
          The I Ching asks: what kind of moment is this? Its wisdom is often less "do this" or "do
          that" than a way of sensing whether the time favors movement, waiting, retreat, repair,
          cooperation, restraint, or decisive action.
        </Text>
      </ArticleSection>

      <ArticleSection title="Trigrams and Hexagrams">
        <Text style={styles.body}>
          The basic building blocks are the eight trigrams. Each trigram has three lines and
          represents a natural force or quality.
        </Text>
        <View style={styles.trigramList}>
          {trigrams.map((trigram) => (
            <View key={trigram.name} style={styles.trigramRow}>
              <TrigramGlyph lines={trigram.lines} />
              <View style={styles.trigramText}>
                <View style={styles.trigramNameBlock}>
                  <Text style={styles.trigramName}>{trigram.name}</Text>
                  <Text style={styles.trigramForce}>{trigram.force}</Text>
                </View>
                <Text style={styles.trigramMeaning}>{trigram.meaning}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.body}>
          A hexagram is made by stacking two trigrams, one below and one above. Together, the eight
          trigrams create 64 possible hexagrams. Lines are read from the bottom upward, so a
          hexagram is not a static picture. It is more like a small map of movement through time.
        </Text>
      </ArticleSection>

      <ArticleSection title="How People Consult It">
        <Text style={styles.body}>
          Traditionally, people consulted the I Ching with yarrow stalks. This method is slow,
          ritualistic, and meditative. A simpler and very common method uses three coins. Each toss
          helps create one line, and six lines make a hexagram.
        </Text>
        <Text style={styles.body}>
          Modern users may consult through coins, cards, digital tools, or an app like this one. The
          method matters, but the spirit matters more.
        </Text>
      </ArticleSection>

      <ArticleSection title="Asking Better Questions">
        <Text style={styles.body}>
          For best results, ask a clear and sincere question. Open-ended questions usually work
          better than yes-or-no questions.
        </Text>
        <View style={styles.exampleBox}>
          <Text style={styles.exampleLabel}>Instead of asking:</Text>
          <Text style={styles.exampleQuestion}>"Will this work?"</Text>
          <Text style={styles.exampleLabel}>Try:</Text>
          <Text style={styles.exampleQuestion}>"What should I understand about this situation?"</Text>
          <Text style={styles.exampleQuestion}>"What is the best way to approach this decision?"</Text>
        </View>
        <Text style={styles.body}>
          Do not treat the answer as a command. Treat it as a conversation with a symbolic text. The
          reading becomes meaningful when you connect it honestly to your own situation.
        </Text>
      </ArticleSection>

      <ArticleSection title="Why Use It Today?">
        <Text style={styles.body}>
          We still live inside change. Jobs shift, relationships evolve, plans break, moods turn,
          doors open, and doors close.
        </Text>
        <Text style={styles.body}>
          The I Ching offers a calm way to pause inside uncertainty. It does not remove the mystery
          of life. It helps you meet that mystery with more attention, humility, and imagination.
        </Text>
        <Text style={styles.body}>
          Use this app as a place to ask, reflect, and return. The answer may not tell you what will
          happen next. It may show you how to stand more wisely in what is already happening.
        </Text>
      </ArticleSection>

      <Pressable
        onPress={() => router.push('/more')}
        style={({ pressed }) => [styles.backLink, pressed && styles.pressed]}>
        <Text style={styles.backText}>Back to More</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function ArticleSection({ children, title }: { children: ReactNode; title: string }) {
  const styles = useWhatIsIChingStyles();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  const styles = useWhatIsIChingStyles();

  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMarker}>-</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function TrigramGlyph({ lines }: { lines: string[] }) {
  const styles = useWhatIsIChingStyles();

  return (
    <View style={styles.trigramGlyph} accessibilityLabel={`Trigram lines: ${lines.join(', ')}`}>
      {lines.map((line, index) => (
        <View key={`${line}-${index}`} style={styles.trigramLineSlot}>
          {line === 'yang' ? (
            <View style={styles.trigramYangLine} />
          ) : (
            <View style={styles.trigramYinLine}>
              <View style={styles.trigramYinSegment} />
              <View style={styles.trigramYinSegment} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function useWhatIsIChingStyles() {
  const { colorMode } = useAppTheme();

  return createWhatIsIChingStyles(getAiChingColors(colorMode));
}

function createWhatIsIChingStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  kicker: {
    color: colors.gold,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 8,
    marginBottom: 18,
    backgroundColor: colors.inkSoft,
  },
  intro: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 18,
  },
  callout: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.34)',
    backgroundColor: 'rgba(139, 93, 29, 0.1)',
    padding: 16,
    marginBottom: 24,
  },
  calloutText: {
    color: colors.mist,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '700',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 93, 29, 0.22)',
    paddingTop: 18,
    marginBottom: 24,
    gap: 10,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
  },
  body: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 25,
  },
  list: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletMarker: {
    minWidth: 12,
    color: colors.gold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
  },
  bulletText: {
    flex: 1,
    color: colors.mist,
    fontSize: 15,
    lineHeight: 23,
  },
  trigramList: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.22)',
    overflow: 'hidden',
  },
  trigramRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 93, 29, 0.16)',
    backgroundColor: colors.surface,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  trigramGlyph: {
    width: 54,
    gap: 5,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#101318',
    padding: 8,
  },
  trigramLineSlot: {
    width: 54,
    height: 6,
    justifyContent: 'center',
  },
  trigramYangLine: {
    height: 5,
    borderRadius: 2,
    backgroundColor: '#e7c56f',
  },
  trigramYinLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trigramYinSegment: {
    width: 22,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#e7c56f',
  },
  trigramText: {
    flex: 1,
    gap: 4,
  },
  trigramNameBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'baseline',
  },
  trigramName: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  trigramForce: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  trigramMeaning: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  exampleBox: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 8,
  },
  exampleLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  exampleQuestion: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '800',
  },
  backLink: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 93, 29, 0.28)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    color: colors.gold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
  });
}
