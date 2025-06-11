import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenView } from '~/components/screen-view';
import { router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';

export default function PracticeScreen() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <ScreenView style={styles.container}>
      <View style={styles.cardsContainer}>
        {/* Speaking Practice Card */}
        <LinearGradient
          colors={['#FBB370', '#EA8934']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="mic" size={40} color="white" />
            </View>

            <Text style={styles.cardTitle}>Speaking</Text>

            <Text style={styles.cardDescription}>
              Improve your listening & pronunciation by speaking out loud sample sentences
            </Text>

            <Button
              className="w-full"
              variant={isDarkColorScheme ? 'secondary' : 'neutral'}
              // style={styles.startButton}
              onPress={() => router.push('/practice/conversation')}
            >
              <Text style={styles.startButtonText}>Start Practice</Text>
            </Button>
          </View>
        </LinearGradient>

        {/* AI Conversation Card */}
        <LinearGradient
          colors={['#63F28D', '#00BC37']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="chatbubble" size={16} color="#5FB560" />
              <Text style={styles.badgeText}>AI Chat Bot</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-ellipses" size={40} color="white" />
            </View>

            <Text style={styles.cardTitle}>AI Conversation</Text>

            <Text style={styles.cardDescription}>
              Improve your grammar & vocabulary by real-time conversation with AI chat bot
            </Text>

            <Button
              className="w-full"
              variant={isDarkColorScheme ? 'secondary' : 'neutral'}
              // style={styles.startButton}
              onPress={() => router.push('/practice/conversation')}
            >
              <Text style={styles.startButtonText}>Start Practice</Text>
            </Button>
          </View>
        </LinearGradient>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 24,
    position: 'relative',
    minHeight: 280,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 160,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  badge: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5FB560',
  },
});
