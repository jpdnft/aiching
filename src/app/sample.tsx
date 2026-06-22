import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HexagramView } from '@/components/HexagramView';
import { PremiumReadingText } from '@/components/PremiumReadingText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { HexagramLines } from '@/core/iching/types';
import { aiChingColors } from '@/theme/colors';

const sampleReadingQuestion = 'What is the wise move in my work situation right now?';
const sampleReadingHexagram = 'Hexagram 4: Youthful Folly';
const sampleChangingHexagram = 'Changing line 6 points toward Hexagram 7: The Army';
const sampleReadingPersonality = 'Dream Librarian';
const sampleReadingTheme = 'Mystical Cats';
const sampleOracleImage = require('@/assets/hexagrams/themes/03/dream_librarian.jpg');
const sampleReadingLines: HexagramLines = [
  'young_yin',
  'young_yang',
  'young_yin',
  'young_yin',
  'young_yin',
  'old_yang',
];

const sampleReadingText = `## Reading: Youthful Folly at the Desk of the Mountain

Your work situation is not asking for brilliance first. It is asking for teachability.

Hexagram 4, Youthful Folly, is the image of a bright but unfinished mind meeting a steep and unfamiliar landscape. In work, this often appears when the terrain is real, the stakes matter, but the map is incomplete. The oracle does not scold you for not knowing enough; it warns against pretending you already do. The wise move is to become the kind of person who can ask the right question before making the wrong declaration.

Mountain above Water gives a particular mood: the mountain stops; the water seeks. Something in the situation is blocked, held back, or not yet ready to flow freely. That is not failure. It is a timing problem, and possibly a learning problem. The path opens more by patience, clarity, and well-aimed inquiry than by force.

## The Core Counsel

The good move now is to **adopt a student's posture with a strategist's eyes**.

That means:

- ask for clarification where the situation is blurry,
- check assumptions before acting on them,
- do not overperform certainty,
- and let the process teach you what the role, project, or people are actually asking of you.

The old books would say: the master does not shame the novice, but neither does the master indulge sloppy attention. There is a narrow, useful dignity here: to be humble without being passive.

If you are feeling pressure to "prove yourself," beware. Youthful Folly often tempts a person into looking wise instead of becoming wise. In work, that usually means speaking too soon, committing too early, or agreeing to a structure before you understand its cost.

## What the Moving Line Says

Only the top line changes, and that matters. The hexagram has been climbing through the lower terrain of uncertainty, and at the top there is a solid yang line turning. This suggests the decisive issue is not at the beginning of the matter, but at the threshold of how you respond to its highest demand.

At the summit, the changing line points toward **The Army**.

That is a strong sign: the situation wants order, coordination, role clarity, and disciplined action. Not chaos, not improvisation by personality alone. The next stage is not "more feeling" but **better organization**.

So the wise move is to gather the scattered pieces:

- define who is responsible for what,
- create a structure for follow-through,
- make expectations visible,
- and let your energy become coordinated rather than diffuse.

If there has been ambiguity, the remedy is not to guess harder. It is to bring the matter into form.

## The Reversed View: Difficulty at the Beginning

Turn the hexagram upside down and it becomes Difficulty at the Beginning. This is useful. It suggests the situation may be younger than it looks. Something is still germinating. A process, team dynamic, or responsibility may be in its awkward first stage, even if people are behaving as though it should already be mature.

From the far side, the question is not "Why is this so unclear?" but "What is just now trying to be born here?"

That view changes your posture. You do not force a seed to behave like a tree. You protect the beginning, simplify the next step, and remain attentive to what is forming beneath the surface.

In practical terms: if the work situation feels jammed, the jam may not be solved by speed. It may need a cleaner beginning: one clearer conversation, one smaller deliverable, one properly named role, one honest admission of what is not yet established.

## The Complementary Field: Revolution

The opposite hexagram, Revolution, stands nearby like a moonlit cat watching from the wall. It does not mean upheaval must happen now, but it reveals a hidden pressure: the situation may contain a need for renewal, not merely adjustment.

This is the shadow and medicine beside Youthful Folly. Where there is confusion, there may also be an outdated pattern that must eventually be replaced. Where people are relying on vague assumptions, the deeper cure may be a change in structure, process, authority, or expectations.

So ask yourself:

- What in this work arrangement is no longer serving the real task?
- What needs to be redefined rather than merely endured?
- Where is the old way still pretending to be enough?

Revolution does not say "burn it down." It says: when the moment is ripe, truth may require a new form. But timing matters. Youthful Folly says: do not force the revolution before you understand the terrain.

## How to Act Now

The oracle's practical advice is beautifully plain:

1. **Ask one or two precise questions.**  
   Not a flood of uncertainty. Just enough to illuminate the structure.

2. **Clarify your role and the expected outcome.**  
   If your work is vague, make it legible.

3. **Do not overpromise.**  
   Honest limits are stronger than polished confusion.

4. **Organize your next steps like a small campaign.**  
   This is the Army's gift: sequence, coordination, responsibility.

5. **Watch for what must be reformed.**  
   If something is fundamentally misaligned, name it gently but clearly.

## Emotional Weather

This is a reading of becoming competent inside uncertainty. It may feel humbling, even a little embarrassing at times, because the work reveals what is not yet known. But that is not a mark against you. It is the beginning of real authority.

There is also a quiet blessing here: the situation is not sealed. It is teachable. A teachable situation can improve. A teachable person can move.

## Concise Practical Counsel

**Be humble, ask clearly, and bring order to the next step.**  
Do not act as if you already know the whole shape of the matter. Find out what is actually being asked, organize your efforts like a small disciplined unit, and be alert to whether this work needs reform more than reassurance.`;

export default function SampleScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.kicker}>Premium Preview</Text>
        <Text style={styles.title}>Sample Premium Reading</Text>
        <Text style={styles.intro}>
          This is an actual Premium reading generated in the app, preserved here so Basic users can
          see what the deeper interpretation experience feels like before subscribing.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metaLabel}>Sample Question</Text>
        <Text style={styles.body}>In this sample, the user asked the following question:</Text>
        <Text style={styles.questionText}>{sampleReadingQuestion}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metaLabel}>Oracle / Personality</Text>
        <Text style={styles.body}>
          In this example, the user had two settings selected: they were using the {sampleReadingTheme}{' '}
          theme, and they had selected the {sampleReadingPersonality} oracle to handle the reading.
        </Text>
        <Text style={styles.body}>
          With multiple themes offered, 10 personalities available per theme, custom questions, and
          the power of oracle-powered interpretation shaped by all of that, the possibilities for
          responses are wonderfully wide open. And the responses can be amazing, too. Have a look.
        </Text>
        <Image source={sampleOracleImage} style={styles.oracleImage} contentFit="cover" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{sampleReadingHexagram}</Text>
        <Text style={styles.body}>
          The cast includes one changing line, so the reading also considers the movement from the
          original hexagram into its changed form.
        </Text>
        <View style={styles.hexagramPreview}>
          <HexagramView lines={sampleReadingLines} size="small" />
        </View>
        <Text style={styles.changeNote}>{sampleChangingHexagram}</Text>
      </View>

      <View style={styles.readingCard}>
        <PremiumReadingText text={sampleReadingText} />
      </View>

      <Pressable
        onPress={() => router.push('/version')}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
        <Text style={styles.secondaryButtonText}>Back to Premium Details</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginBottom: 22,
  },
  kicker: {
    color: aiChingColors.gold,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: aiChingColors.mist,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
  },
  intro: {
    color: aiChingColors.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.16)',
    backgroundColor: aiChingColors.surface,
    padding: 18,
    gap: 8,
    marginBottom: 18,
  },
  cardTitle: {
    color: aiChingColors.gold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  metaLabel: {
    color: aiChingColors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  body: {
    color: aiChingColors.mist,
    fontSize: 16,
    lineHeight: 24,
  },
  questionText: {
    color: aiChingColors.gold,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '800',
  },
  oracleImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: 'rgba(16, 19, 24, 0.42)',
  },
  hexagramPreview: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  changeNote: {
    color: aiChingColors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  readingCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.18)',
    backgroundColor: 'rgba(16, 19, 24, 0.72)',
    padding: 18,
    marginBottom: 22,
  },
  secondaryButton: {
    alignSelf: 'center',
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 197, 111, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: aiChingColors.gold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.72,
  },
});
