import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const PLANS = [
  {
    id: 'basic',
    title: 'Basic',
    tagline: 'Ideal for Beginners',
    price: '199',
    period: '/mo',
    benefits: ['Demo', 'Demo', 'Demo', 'Demo'],
    colors: ['#FFFFFF', '#F0F5FF'],
    itemColor: '#4560F4',
  },
  {
    id: 'standard',
    title: 'Standard',
    tagline: 'Our Best Seller',
    price: '499',
    period: '/mo',
    benefits: ['Demo', 'Demo', 'Demo', 'Demo'],
    colors: ['#FFFFFF', '#E8F9FF'],
    itemColor: '#00C6FF',
  },
  {
    id: 'premium',
    title: 'Premium',
    tagline: 'Maximum Growth',
    price: '899',
    period: '/mo',
    benefits: ['Demo', 'Demo', 'Demo', 'Demo'],
    colors: ['#FFFFFF', '#F6EFFF'],
    itemColor: '#7210EA',
  },
];

const PricingPlansScreen = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = width * 0.88;
  const cardHeight = height * 0.54;
  const spacing = (width - cardWidth) / 2;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPlanCard = ({ item, index }: { item: typeof PLANS[0], index: number }) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    const stackShift = scrollX.interpolate({
      inputRange: [index * cardWidth, (index + 1) * cardWidth],
      outputRange: [0, -cardWidth],
      extrapolate: 'clamp',
    });

    const translateX = Animated.add(
        scrollX.interpolate({
            inputRange,
            outputRange: [0, 0, cardWidth * 0.9],
            extrapolate: 'clamp',
        }),
        stackShift
    );

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 1],
      extrapolate: 'clamp',
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-3deg', '0deg', '4deg'],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange: [
        (index - 1) * cardWidth,
        index * cardWidth,
        (index + 1) * cardWidth,
      ],
      outputRange: [0.4, 1, 1],
      extrapolate: 'clamp',
    });

    const zIndex = PLANS.length - index;

    return (
      <View style={{ width: cardWidth, height: cardHeight, zIndex }}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              width: cardWidth,
              height: cardHeight,
              opacity,
              transform: [
                { perspective: 1200 },
                { translateX },
                { scale },
                { rotate },
              ],
              shadowColor: item.itemColor,
              shadowOpacity: 0.5,
              shadowRadius: 25,
            },
          ]}
        >
          <LinearGradient
            colors={['#1E293B', '#0F172A']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.topSection}>
                <View style={[styles.planBadge, { backgroundColor: item.itemColor + '30' }]}>
                  <Text style={[styles.planBadgeText, { color: item.itemColor }]}>{item.tagline}</Text>
                </View>
                <Text style={styles.largeTitle}>{item.title}</Text>
              </View>

              <View style={styles.benefitsList}>
                {item.benefits.map((benefit, i) => (
                  <View key={`benefit-${index}-${i}`} style={styles.benefitItem}>
                    <Ionicons name="checkmark-done-circle" size={22} color={item.itemColor} style={{ marginRight: 12 }} />
                    <Text style={styles.benefitLabel}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.pricingFooter, { backgroundColor: '#FFFFFF12', borderColor: 'rgba(255,255,255,0.15)' }]}>
                <View style={styles.priceContainer}>
                   <Text style={[styles.currencySymbol, { color: item.itemColor }]}>₹</Text>
                   <Text style={[styles.priceAmount, { color: '#FFFFFF' }]}>{item.price}</Text>
                   <Text style={styles.pricePeriod}>{item.period}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.titleHeadline}>UPGRADE NOW</Text>
        <Text style={styles.titleSub}>Unlock premium features for your growth.</Text>
      </View>

      <View style={styles.stackWrapper}>
        <Animated.FlatList
          data={PLANS}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: spacing,
            height: cardHeight + 60,
            alignItems: 'center',
          }}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
          pagingEnabled
        />

        <View style={styles.dotsRow}>
          {PLANS.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.progressDot,
                activeIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footerAction}>
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.92}
          onPress={() => router.push('/worker/PlanSuccessScreen')}
        >
          <LinearGradient
            colors={['#4560F4', '#00C6FF']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>ACTIVATE PLAN</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PricingPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  titleHeadline: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  titleSub: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 5,
    fontWeight: '400',
  },
  stackWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWrapper: {
    borderRadius: 45,
    overflow: 'hidden',
    elevation: 25,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
  },
  cardGradient: {
    flex: 1,
    padding: 30,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'flex-start',
  },
  planBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    marginBottom: 10,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  largeTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFF',
  },
  benefitsList: {
    marginVertical: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitLabel: {
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  pricingFooter: {
    marginTop: 20,
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 30,
    fontWeight: '700',
    marginRight: 5,
  },
  priceAmount: {
    fontSize: 60,
    fontWeight: '900',
  },
  pricePeriod: {
    fontSize: 20,
    color: '#94A3B8',
    marginLeft: 6,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  progressDot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#4560F4',
    width: 32,
  },
  dotInactive: {
    backgroundColor: '#334155',
    width: 10,
  },
  footerAction: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  primaryButton: {
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4560F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
