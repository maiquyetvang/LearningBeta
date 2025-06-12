import { Lottie } from 'assets';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function StreakModal({
  visible,
  streak,
  onClose,
}: {
  visible: boolean;
  streak: number;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/90">
          <LottieView
            source={Lottie.longConfetti}
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
            }}
            autoPlay
            loop={false}
          />
          <TouchableWithoutFeedback>
            <View className="rounded-xl p-6 items-center " style={{ overflow: 'visible' }}>
              <Text className="text-3xl font-bold text-center text-primary mb-2">
                Streak Badge Upgraded!
              </Text>
              <Text className="text-lg text-center text-white mb-4">
                You have been learning Korean{'\n'}for {streak} consecutive days.
              </Text>
              <View
                style={{
                  width: 240,
                  height: 240,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginBottom: 16,
                }}
              >
                <LottieView
                  source={Lottie.fire}
                  style={{ width: 240, height: '100%' }}
                  autoPlay
                  loop
                />
                <Text
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    // left: 0,
                    right: -5,
                    fontSize: 40,
                    fontWeight: 'bold',
                    color: '#a259ff',
                    textShadowColor: '#fff',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 8,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {streak}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
