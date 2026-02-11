import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const introSlides = [
  {
    id: 'deliver-fast',
    icon: 'bicycle-outline',
    title: 'Fast & Smart Deliveries',
    description: 'Accept orders quickly, follow the optimized delivery flow, and complete drops faster.',
  },
  {
    id: 'earnings',
    icon: 'wallet-outline',
    title: 'Track Earnings Clearly',
    description: 'Monitor payout balance, bank details, and shift performance from one place.',
  },
  {
    id: 'safety',
    icon: 'shield-checkmark-outline',
    title: 'Safety & Support First',
    description: 'Access training modules and raise issues in seconds whenever you need help.',
  },
];

export default function IntroOnboardingScreen({ onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = useMemo(() => introSlides[activeIndex], [activeIndex]);
  const isLastSlide = activeIndex === introSlides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete?.();
      return;
    }

    setActiveIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    onComplete?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#16A34A', '#22C55E']} style={styles.header}>
        <View style={styles.skipRow}>
          <Pressable onPress={handleSkip} hitSlop={10} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.heroIconWrap}>
          <Icon name={activeSlide.icon} size={58} color="#fff" />
        </View>

        <Text style={styles.title}>{activeSlide.title}</Text>
        <Text style={styles.description}>{activeSlide.description}</Text>
      </LinearGradient>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {introSlides.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
          <Icon name={isLastSlide ? 'checkmark' : 'arrow-forward'} size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipRow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  skipText: { color: '#fff', fontWeight: '700' },
  heroIconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
  },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center' },
  description: {
    marginTop: 12,
    color: '#ECFDF5',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#16A34A',
  },
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginRight: 6,
  },
});
