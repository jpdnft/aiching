import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const productionAndroidTopBannerAdUnitId = 'ca-app-pub-6827002425129688/6148893375';

export function TopAdBanner() {
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: productionAndroidTopBannerAdUnitId,
        ios: TestIds.BANNER,
        default: TestIds.BANNER,
      });

  useEffect(() => {
    mobileAds()
      .initialize()
      .catch(() => {
        // The placeholder remains visible if the native ad SDK cannot initialize.
      });
  }, []);

  return (
    <View style={styles.adBanner}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
      <Text style={styles.adLabel}>Advertisement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  adBanner: {
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(231, 197, 111, 0.16)',
  },
  adLabel: {
    color: 'rgba(219, 226, 223, 0.58)',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
