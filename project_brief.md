# AI Ching App — Codex Build Instructions

## Project Overview

Build a mobile-first app called **AI Ching**: a modern, serene I Ching-inspired daily reflection app.

The core experience is a ritualized hexagram casting interface. The user taps a button six times. Each tap generates one line of a six-line hexagram, building from the bottom upward. After the sixth line is cast, the completed hexagram can be revealed/interpreted.

The app should begin as a simple, polished MVP, but it should be architected with future premium features in mind: AI-guided interpretations, changing lines, resulting hexagrams, reading history, journaling, feature voting, custom artwork, subscriptions, and pattern insights.

The product should feel like a calm symbolic reflection tool, not a fortune-telling gimmick. The tone should be elegant, grounded, poetic, and modern.

---

# Recommended Stack

Use:

* **Expo**
* **React Native**
* **TypeScript**
* Local storage for v1 reading history and daily usage limits
* Modular app structure so the core hexagram/oracle logic can later be reused in web, cloud functions, or AI endpoints

Do not initially implement:

* user accounts
* subscriptions
* AI API calls
* cloud sync
* push notifications
* ad integration
* app-store billing

However, structure the app so these can be added later without major rewrites.

---

# Core Product Philosophy

The app should be:

* mobile-native
* vertical
* serene
* tactile
* visually polished
* ritualistic without being cheesy
* reflective rather than predictive
* minimal but expandable

Avoid language that implies guaranteed future prediction. Interpretations should be framed as symbolic reflection.

Preferred language:

> “This reading invites you to consider…”

Avoid language like:

> “This means that X will happen.”

---

# Initial App Navigation

Use a simple bottom tab interface.

Suggested tabs:

1. **Cast**
2. **History**
3. **Guide**
4. **Future**

If History is not ready for the first pass, include the tab but allow it to show an empty state.

---

# Phase 1 — MVP: Core Casting Experience

## Goal

Build a beautiful, functional, local-only MVP that allows one hexagram cast per day and displays a basic interpretation.

## Core Screens

### 1. Cast Screen

This is the main home screen.

Design:

* serene background
* centered vertical casting area
* tall unfilled rectangle or subtle frame where the six lines will appear
* button below the hexagram frame
* optional question input above or below the frame

Initial button label:

> CAST

After six lines are complete, button label changes to:

> REVEAL

When the reading has already been completed for the day, the screen should show the completed daily hexagram and a gentle message that the user may return tomorrow.

Example:

> Today’s reading has been cast. Return tomorrow for a new one.

### Casting Behavior

The user taps **CAST** six times.

Each tap:

* randomly generates one hexagram line
* animates the line into the stack
* builds the hexagram from bottom to top
* updates progress from 1/6 through 6/6

For v1, each line may be simple binary:

* yang / solid line
* yin / broken line

Use a clean visual representation:

Yang:

```text
────────
```

Yin:

```text
───  ───
```

The stack must be built bottom-up, meaning the first generated line is the bottom line, and the sixth generated line is the top line.

After the sixth line is generated:

* disable additional casting
* change button to **REVEAL**
* tapping **REVEAL** navigates to the Reading screen

---

### 2. Reading Screen

Shows:

* smaller version of completed hexagram
* hexagram number
* hexagram name
* short basic interpretation
* optional user question, if provided
* button to return home
* optional button to share later, but sharing can be deferred

Interpretation should be concise and reflective.

Suggested sections:

* **Theme**
* **Reflection**
* **Today’s Prompt**

Example structure:

```text
Hexagram 30 — Radiance

Theme:
Clarity, illumination, perception, and the need to see clearly.

Reflection:
This reading invites you to notice what is already visible but perhaps not fully acknowledged. Radiance is not only brightness; it is the discipline of seeing without distortion.

Today’s Prompt:
Where do you need more clarity before taking action?
```

---

### 3. History Screen

For v1, support local reading history if practical.

Each history entry should store:

* date
* line pattern
* hexagram number
* hexagram name
* question, if any
* basic interpretation summary

If reading history is deferred, create the screen with an empty state:

> Your past readings will appear here.

Future architecture should allow this to become cloud-synced later.

---

### 4. Guide Screen

Explain the basics of the app and the I Ching-inspired structure.

Include short sections:

* What is a hexagram?
* How casting works
* Why lines build from the bottom upward
* Yin and yang lines
* Reflection, not prediction
* Coming later: changing lines and deeper interpretations

Tone should be simple and inviting.

Do not overcomplicate this screen.

---

### 5. Future Screen

This is a “coming soon” and feedback screen.

Title options:

> Help Shape the Future

or:

> Coming Soon

This screen should preview possible future/premium features and invite feedback.

Feature cards:

* Deeper AI interpretations
* AI chat about your reading
* Changing lines + resulting hexagrams
* Reading history
* Personal journal
* Pattern insights across readings
* Custom hexagram artwork
* More daily casts
* Shareable reading cards
* Optional reminders

Add a simple feedback form if practical.

Feedback fields:

* selected feature(s)
* freeform comment
* optional email
* timestamp
* platform
* app version

For v1, if no backend is present, use a placeholder feedback UI and clearly mark it as coming soon. If a simple backend is easy to add, use Supabase, Firebase, or another lightweight endpoint.

---

# Hexagram Engine

Create a separate core module for all hexagram logic.

Suggested folder:

```text
/src/core/iching/
```

Suggested files:

```text
types.ts
generate.ts
hexagrams.ts
lookup.ts
changingLines.ts
interpretation.ts
```

Even if changing lines are not active in v1, leave room in the types.

## Types

Represent lines clearly.

For v1:

```ts
type BasicLine = "yin" | "yang";
```

For future compatibility:

```ts
type LineState =
  | "young_yin"
  | "young_yang"
  | "old_yin"
  | "old_yang";
```

Changing lines:

* old_yin changes to yang
* old_yang changes to yin

V1 can use only young_yin and young_yang, or map simple yin/yang to non-changing states.

## Hexagram Representation

A hexagram should be represented bottom-up.

Example:

```ts
type HexagramLines = [
  LineState,
  LineState,
  LineState,
  LineState,
  LineState,
  LineState
];
```

Important: index 0 should represent the bottom line.

Document this clearly in the code.

---

# Hexagram Data

Create a local data file for all 64 hexagrams.

Each hexagram should eventually include:

```ts
type Hexagram = {
  number: number;
  name: string;
  chineseName?: string;
  binaryKey: string;
  lines: ("yin" | "yang")[];
  keywords: string[];
  theme: string;
  basicInterpretation: string;
  reflectionPrompt: string;
  future?: {
    traditional?: string;
    career?: string;
    relationship?: string;
    creative?: string;
    shadow?: string;
  };
};
```

For the first implementation, if full interpretation data for all 64 hexagrams is not available, create placeholder entries with clear TODO markers.

However, the app should be designed to support all 64 hexagrams.

---

# Daily Limit Logic

For v1 Basic mode:

* user may perform one completed cast per local calendar day
* store the current day’s reading locally
* if the app is reopened on the same day, show the existing reading
* on the next day, allow a new cast

Use device-local date for v1.

Future architecture may move this to authenticated cloud logic.

---

# Animation Requirements

The casting animation should be simple but satisfying.

Each line should:

* appear after a CAST tap
* animate downward or fade/slide into its correct position
* lock into the stack
* preserve consistent spacing and scale

The visual should communicate that the hexagram is built from bottom to top.

Do not overbuild animations in v1. Smooth and tasteful is better than flashy.

---

# Visual Direction

Overall feel:

* calm
* dark or twilight palette
* soft gradients
* subtle texture
* elegant line art
* minimal interface chrome
* readable typography
* no clutter

The hexagram should be the visual hero.

Avoid generic New Age clipart.

The design should feel closer to:

* premium meditation app
* symbolic art object
* quiet game ritual
* modern oracle

Rather than:

* casino
* horoscope spam
* cluttered spiritual website

---

# Future Premium Features

Do not build these in Phase 1 unless explicitly instructed.

However, keep the architecture ready for them.

## Phase 2 — Feedback + Analytics

Add:

* anonymous user ID
* feedback submission
* feature voting
* basic analytics
* crash reporting
* app version tracking
* optional email capture

Track:

* cast started
* cast completed
* reveal tapped
* reading saved
* future feature voted
* feedback submitted
* return user
* daily reading completed

---

## Phase 3 — Changing Lines + Resulting Hexagrams

Upgrade casting from simple yin/yang to four possible line states:

* young yin
* young yang
* old yin
* old yang

Changing lines:

* old yin becomes yang
* old yang becomes yin

The app should then support:

* primary hexagram
* changing lines
* resulting hexagram
* interpretation of the transition

Example display:

```text
Hexagram 30 — Radiance
changing to
Hexagram 55 — Abundance
```

This feature may be part of Premium.

---

## Phase 4 — AI Interpretations

Add AI-guided reading interpretation.

The AI should use:

* user’s question
* generated hexagram
* changing lines, if any
* resulting hexagram, if any
* curated hexagram metadata
* previous reading history, if user has enabled that

Important:

* Do not make the AI the source of truth for hexagram data.
* Use structured local or server-side hexagram data as grounding context.
* Keep interpretation reflective, not predictive.
* Avoid medical, legal, financial, or crisis advice.
* Include safety boundaries.

Possible AI modes:

* Basic explanation
* Deeper interpretation
* Ask follow-up questions
* Relationship lens
* Career lens
* Creative lens
* Shadow/warning lens
* One-sentence summary

---

## Phase 5 — Journaling + History

Add richer saved readings.

Each reading may include:

* user question
* primary hexagram
* changing lines
* resulting hexagram
* interpretation
* user journal note
* mood tag
* favorite/starred flag
* createdAt
* updatedAt

Premium users may receive pattern insights based on prior readings.

Example:

> You’ve recently drawn several readings involving waiting, obstruction, and gradual progress. The recurring theme may be timing rather than effort.

---

## Phase 6 — Custom Hexagram Artwork

Add custom background imagery or symbolic art for each hexagram.

Each hexagram may have:

* background image
* color palette
* symbolic motif
* share-card image
* animation variant

These assets should be managed separately from core interpretation data.

Suggested structure:

```text
/assets/hexagrams/01/
  background.png
  card.png
  thumbnail.png
```

---

## Phase 7 — Shareable Reading Cards

Allow users to export/share a visual card for a reading.

Suggested square format:

* hexagram visual
* hexagram name and number
* one-sentence reflection
* date
* optional app branding

Avoid including private user questions unless user explicitly chooses to include them.

---

## Phase 8 — Premium / Subscription

Add paid features only after the core app and feedback loop are working.

Likely Premium bundle:

* deeper AI interpretation
* AI chat
* changing lines + resulting hexagram
* extended reading history
* journaling
* pattern insights
* more than one cast per day
* custom themes/art
* share cards

Use RevenueCat or equivalent to simplify iOS/Android subscriptions.

Do not implement subscriptions in the initial MVP unless explicitly requested.

---

# App Tone / Copy Guidelines

Tone should be:

* calm
* intelligent
* poetic but clear
* modern
* lightly mystical, not goofy
* grounded in reflection

Avoid:

* fake certainty
* fear-based language
* overpromising
* “the universe demands…”
* medical/legal/financial advice
* manipulative paywall copy

Example language:

Good:

> This reading invites you to pause before forcing clarity.

Bad:

> This proves you must leave your job immediately.

Good:

> The pattern suggests tension between momentum and patience.

Bad:

> Your destiny is blocked.

---

# Safety / Ethical Framing

Include a short disclaimer in Guide or Settings:

> AI Ching is designed for reflection, journaling, and symbolic exploration. It does not predict the future and should not be used as a substitute for professional advice.

If AI chat is later added, ensure the assistant does not provide definitive medical, legal, financial, or crisis guidance.

---

# Development Priorities

## First build target

Create a polished Expo app that supports:

1. Bottom tab navigation
2. Cast screen
3. Six-tap hexagram generation
4. Bottom-up line animation
5. Daily local limit
6. Reading reveal screen
7. Local hexagram lookup
8. Guide screen
9. Future/feedback placeholder screen

## Do not overbuild

The first version should feel elegant and usable.

Prioritize:

* clean architecture
* good mobile UX
* readable code
* polished core ritual
* clear separation of oracle logic from UI

Defer everything that requires backend, auth, billing, or AI unless specifically requested.

---

# Suggested Folder Structure

```text
/src
  /app
    /navigation
    /screens
      CastScreen.tsx
      ReadingScreen.tsx
      HistoryScreen.tsx
      GuideScreen.tsx
      FutureScreen.tsx
  /components
    HexagramView.tsx
    HexagramLine.tsx
    CastButton.tsx
    ScreenContainer.tsx
    FeatureCard.tsx
  /core
    /iching
      types.ts
      generate.ts
      lookup.ts
      hexagrams.ts
      interpretation.ts
      changingLines.ts
  /storage
    readingsStorage.ts
    dailyLimitStorage.ts
  /theme
    colors.ts
    typography.ts
    spacing.ts
  /utils
    date.ts
```

---

# Acceptance Criteria for MVP

The MVP is successful when:

* app opens to Cast screen
* user can tap CAST six times
* one line is generated per tap
* hexagram builds from bottom to top
* after six taps, the button changes to REVEAL
* tapping REVEAL shows a reading screen
* the reading screen displays the completed hexagram and basic interpretation
* the app stores today’s completed reading locally
* user cannot cast another reading on the same local day
* bottom navigation includes Cast, History, Guide, Future
* Guide explains the core concept
* Future screen lists planned features and invites feedback
* code separates hexagram logic from UI
* TypeScript types clearly document bottom-up line ordering
* app is ready to later add changing lines, AI, journaling, subscriptions, and custom art

---

# Initial Development Note

Start by scaffolding the Expo TypeScript app, building the core hexagram generation/lookup module, and creating the Cast screen with local state. Once the casting flow works, add navigation, reading display, local daily persistence, and the remaining informational screens.

Keep all future-premium concepts represented in structure and placeholder UI, but do not implement paid functionality yet.
