import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumReadingText } from '@/components/PremiumReadingText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { aiChingColors } from '@/theme/colors';

const sampleReadingQuestion = 'Will I be successful in my job search?';
const sampleReadingHexagram = 'Hexagram 52: Keeping Still';
const sampleReadingPersonality = 'Weathered Sage';
const sampleReadingTheme = 'Mystical Cats';
const sampleOracleImage = require('@/assets/hexagrams/themes/03/weathered_sage.jpg');

const sampleReadingText = `## The Heart of the Reading: Keeping Still

Hexagram 52, **Keeping Still**, is a plainspoken oracle for a job search that may be asking for more composure than speed. Mountain upon mountain: there is no dramatic climbing here, no charge up the ridge with banner flying. The image is of a person who knows when to stop, breathe, and let the mind settle back into its true proportions.

So, to your question: **the reading does not favor frantic effort; it favors disciplined stillness, selective action, and clear boundaries.** In practical terms, this means your job search is more likely to bear fruit if you resist the urge to scatter yourself. Pause without apology. Not every posting deserves an application. Not every opportunity deserves your energy. And not every silence from the world is a rejection; some silences are simply the world not yet having formed its answer.

There is a quiet dignity in this hexagram. It suggests that success comes not by proving yourself at every turn, but by becoming centered enough that your next step is well chosen.

## What “Success” Looks Like Here

This is not the kind of omen that says, “Press harder and you shall prevail.” It says something subtler: **success comes through proportion**.

In a job search, keeping still can mean:

- refining your materials instead of endlessly sending them out,
- waiting long enough to recognize the right opening,
- not collapsing your worth into the outcome of one interview,
- making room for discernment rather than desperation,
- and holding your ground when self-doubt tries to make a fool of you.

A mountain does not chase the clouds; it stands, and in time the weather reveals the shape of things. That is the counsel here. If you are too restless, you may blur your own signal. If you are too passive, you may miss the moment. The art is in **stillness with alertness**.

## The Reversed View: Hexagram 51, The Arousing

Flipped over, Keeping Still becomes **The Arousing**—shock, awakening, thunder. This is the hidden counterpoint. It suggests that beneath the quiet surface, something may jolt you into motion: an unexpected contact, a sudden opening, a sharp realization about what kind of work you truly want.

So the job search may not unfold as a smooth, linear ascent. There may be a moment of interruption, a bit of news that startles you, or a push that reveals what you had been avoiding. Sometimes the mountain must be shaken before one discovers what is loose and what is solid.

This is useful counsel: **do not mistake stillness for stagnation**. The reading asks you to prepare inwardly so that when the jolt comes, you can move cleanly rather than flail. Keep your documents ready. Keep your mind ready. Keep your nerves from writing checks your future cannot cash.

From the far side, another self is looking back through The Arousing and saying: *Be ready. The opening may not arrive in the form you expected.*

## The Complementary Field: Hexagram 58, The Joyous

The opposite current is **The Joyous**—exchange, openness, shared delight, gracious communication. This matters a great deal in a job search, because it points to the medicine that balances your mountain-stillness.

If Keeping Still says, “Do not overreach,” The Joyous says, “Do not harden.”

A job search is not only a matter of qualifications; it is also a matter of resonance. Do you sound like someone who can exchange ideas, take part in a team, bring some warmth into the room? Do you allow a little human ease to come through your words? The Joyous suggests that **connection, conversation, and a light touch** may be more persuasive than anxious self-justification.

But there is also a shadow here: you may be tempted to cheer yourself into pretending all is well, or to smile through uncertainty until you no longer know what you actually need. The balance is to be open without being porous, friendly without being inflated.

So the contrast between 52 and 58 is instructive:  
- **52** protects your center.  
- **58** helps you relate without rigidity.  

Together they say: be steady, but not sealed.

## What This Says About Timing

Timing is the secret spine of this reading. Mountain times are not thunder times. If you rush, you may arrive out of season. If you wait too long, you may miss the gate. The counsel is to **watch for the boundary**—that moment where movement becomes appropriate rather than merely habitual.

A good question to ask yourself is:  
**Where would stopping restore my true proportions?**

That may mean stopping the endless scrolling, stopping the self-reproach, stopping the habit of applying in a fever, stopping the urge to interpret every delay as doom. It may also mean stopping long enough to notice what kind of job actually fits your character, rather than only your fear.

## A Practical Reading for the Search Itself

If I were to translate this into plain worldly advice, I would say:

- Tighten your search to the roles that genuinely suit you.
- Revise your resume and cover letter with patience, not haste.
- Ask one or two trusted people for feedback rather than everyone at once.
- Prepare carefully for interviews; don’t improvise your worth.
- Keep one eye on openings, and the other on your own steadiness.
- Let a surprise contact or sudden opportunity wake you up, but do not let it unseat you.

This is not an oracle of easy victory, but it is not gloomy either. It suggests that **success is available when you stop wasting force**. The mountain does not shout. Yet it endures, and endurance has its own way of opening doors.

## Concise Practical Counsel

**Pause, refine, and choose.**  
Apply less widely but more wisely. Stay ready for a sudden opening, and let warmth and clear communication soften your stillness. Keep your center, and let the right opportunity find the shape of it.`;

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
          theme, and they had selected the {sampleReadingPersonality} as the oracle handling the
          reading.
        </Text>
        <Text style={styles.body}>
          With multiple themes offered, 10 personalities available per theme, custom questions, and
          the power of LLM-based interpretation shaped by all of that, the possibilities for
          responses are wonderfully wide open. And the responses can be amazing, too. Have a look.
        </Text>
        <Image source={sampleOracleImage} style={styles.oracleImage} contentFit="cover" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{sampleReadingHexagram}</Text>
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
