import { Lottie } from 'assets';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { ArrowRight } from '~/lib/icons/ArrowRight';
import { ChevronLeft } from '~/lib/icons/ChevronLeft';

const { width } = Dimensions.get('window');

const steps = [
  {
    image: require('assets/images/splash-icon.png'),
    title: '',
    desc: 'Enjoying an integrated learning center for Korean and Korean culture through Online',
    button: 'Next',
  },
  {
    image: require('assets/images/kindo-play.png'),
    lottie: Lottie.playing_game,
    title: 'Learn as Play',
    desc: 'Learning through interaction quiz to enhance the experience',
    button: 'Next',
  },
  {
    image: require('assets/images/kindo-trophy.png'),
    lottie: Lottie.goal,
    title: 'Get Achievements',
    desc: 'Earn achievements as a prize for your hard working',
    button: 'Learn Today!',
  },
];

export default function WelcomeScreen() {
  const [step, setStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (step < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: step + 1 });
    } else {
      router.replace('/login');
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      flatListRef.current?.scrollToIndex({ index: step - 1 });
    }
  };

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: {
        item: (typeof steps)[number];
        key: string;
        index: number | null;
        isViewable: boolean;
        section?: any;
      }[];
      changed: {
        item: (typeof steps)[number];
        key: string;
        index: number | null;
        isViewable: boolean;
        section?: any;
      }[];
    }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null)
        setStep(viewableItems[0].index);
    },
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.content, { width }]}>
            {item.lottie ? (
              <LottieView
                source={item.lottie}
                style={{ height: 240, width: '100%' }}
                autoPlay
                loop
              />
            ) : (
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            )}

            {!!item.title && <Text style={styles.title}>{item.title}</Text>}
            <Text style={styles.desc}>{item.desc}</Text>
            {/* <AntDesign name='google' size={20} style={{ marginRight: 8 }} /> */}
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        // viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      <View style={styles.dots}>
        {steps.map((_, idx) => (
          <View key={idx} style={[styles.dot, idx === step && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.buttonRow}>
        {step > 0 && (
          <Button
            variant="neutral"
            className="native:px-3"
            style={styles.prevBtn}
            onPress={handlePrev}
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Button>
        )}
        <Button style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>{steps[step].button}</Text>
          {steps && step < steps.length - 1 && <ArrowRight className="text-white" size={20} />}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    justifyContent: 'center',
    // padding: 20,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: 180, height: 180, marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E42',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    // color: "#222",
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#eee',
    margin: 4,
  },
  dotActive: { backgroundColor: '#F59E42' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  prevBtn: {
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    // backgroundColor: "#eee",
  },
  nextBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    // backgroundColor: "#F59E42",
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  prevText: {
    fontSize: 18,
    // color: "#F59E42",
  },
  nextText: {
    // fontSize: 18,
    // color: "#fff",
    fontWeight: '500',
  },
});
