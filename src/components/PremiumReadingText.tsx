import { ReactNode } from 'react';
import { StyleSheet, StyleProp, Text, TextStyle, View } from 'react-native';

import { useAppTheme } from '@/theme/appTheme';
import { AiChingColorPalette, getAiChingColors } from '@/theme/colors';

export function PremiumReadingText({
  compact = false,
  headingStyle,
  text,
  textStyle,
}: {
  compact?: boolean;
  headingStyle?: StyleProp<TextStyle>;
  text: string;
  textStyle?: StyleProp<TextStyle>;
}) {
  const styles = usePremiumReadingTextStyles();
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <View style={[styles.markdown, compact && styles.markdownCompact]}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const firstLine = lines[0] ?? '';
        const headingMatch = firstLine.match(/^(#{1,3})\s+(.+)$/);

        if (headingMatch) {
          const [, marks, heading] = headingMatch;

          return (
            <Text
              key={`heading-${blockIndex}`}
              style={[
                marks.length === 1 ? styles.headingLarge : styles.heading,
                compact && styles.headingCompact,
                headingStyle,
              ]}>
              {stripTrailingMarkdownMarks(heading)}
            </Text>
          );
        }

        if (lines.every((line) => /^([-*]|\d+[.)])\s+/.test(line))) {
          return (
            <View key={`list-${blockIndex}`} style={styles.list}>
              {lines.map((line, lineIndex) => {
                const listMatch = line.match(/^([-*]|\d+[.)])\s+(.+)$/);
                const marker = listMatch?.[1] ?? '-';
                const content = listMatch?.[2] ?? line;
                const bullet = /^\d/.test(marker) ? marker.replace(/[.)]$/, '.') : '-';

                return (
                  <View key={`list-item-${blockIndex}-${lineIndex}`} style={styles.listItem}>
                    <Text style={[styles.bullet, compact && styles.textCompact, textStyle]}>{bullet}</Text>
                    <Text style={[styles.listText, compact && styles.textCompact, textStyle]}>
                      {renderInlineMarkdown(content, `list-${blockIndex}-${lineIndex}`, styles)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }

        return (
          <Text
            key={`paragraph-${blockIndex}`}
            style={[styles.paragraph, compact && styles.textCompact, textStyle]}>
            {renderInlineMarkdown(lines.join(' '), `paragraph-${blockIndex}`, styles)}
          </Text>
        );
      })}
    </View>
  );
}

function renderInlineMarkdown(
  text: string,
  keyPrefix: string,
  styles: ReturnType<typeof createPremiumReadingTextStyles>,
): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={`${keyPrefix}-bold-${index}`} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      );
    }

    return part;
  });
}

function stripTrailingMarkdownMarks(text: string): string {
  return text.replace(/\s+#+$/, '').trim();
}

function usePremiumReadingTextStyles() {
  const { colorMode } = useAppTheme();

  return createPremiumReadingTextStyles(getAiChingColors(colorMode));
}

function createPremiumReadingTextStyles(colors: AiChingColorPalette) {
  return StyleSheet.create({
  markdown: {
    gap: 12,
  },
  markdownCompact: {
    gap: 10,
  },
  paragraph: {
    color: colors.mist,
    fontSize: 16,
    lineHeight: 25,
  },
  textCompact: {
    fontSize: 14,
    lineHeight: 21,
  },
  headingLarge: {
    color: colors.gold,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  heading: {
    color: colors.gold,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  headingCompact: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '800',
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    minWidth: 22,
    color: colors.gold,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '800',
  },
  listText: {
    flex: 1,
    color: colors.mist,
    fontSize: 16,
    lineHeight: 25,
  },
  });
}
