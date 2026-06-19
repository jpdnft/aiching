import { StyleSheet, Text, View } from 'react-native';

export function TopAdBanner() {
  return (
    <View style={styles.adBanner}>
      <Text style={styles.adLabel}>Advertisement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  adBanner: {
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(231, 197, 111, 0.16)',
  },
  adLabel: {
    color: 'rgba(219, 226, 223, 0.58)',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
