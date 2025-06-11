import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AppImages } from 'assets';
import { Moon, Sun } from 'lucide-react-native'; // hoặc icon bạn thích
import React, { useCallback } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginStep } from '~/components/login/LoginScreen';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useLessonBottomSheet } from '~/hooks/useLessonBottomSheet';
import { useColorScheme } from '~/lib/useColorScheme';
import RegisterScreen from '../../components/login/RegisterScreen';

export enum ELoginScreen {
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY = 'verify',
  DONE = 'done',
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const { bottomSheetRef, openBottomSheet, closeBottomSheet, handleSheetChanges } =
    useLessonBottomSheet();
  const [step, setStep] = React.useState<ELoginScreen>(ELoginScreen.LOGIN);
  const handleStepChange = useCallback((step: ELoginScreen) => {
    setStep(step);
  }, []);
  const handleClose = () => {
    closeBottomSheet();
  };
  const renderStep = () => {
    switch (step) {
      case ELoginScreen.REGISTER:
        return <RegisterScreen onNextStep={handleStepChange} onClose={handleClose} />;
      default:
        return <LoginStep onNextStep={handleStepChange} onClose={handleClose} />;
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <View className="ml-auto pr-5">
          <TouchableOpacity onPress={toggleColorScheme} hitSlop={10}>
            {isDarkColorScheme ? (
              <Sun size={24} color="#F59E42" />
            ) : (
              <Moon size={24} color="#222" />
            )}
          </TouchableOpacity>
        </View>
        <View className="p-5 gap-5 flex-1 justify-center items-center">
          <View className=" flex-1 justify-center items-center ">
            <Image
              source={isDarkColorScheme ? AppImages.splash_icon_dark : AppImages.splash_icon}
              height={180}
              width={180}
              style={styles.image}
              resizeMode="contain"
            />
            <Text className="text-center ">
              Enjoying an integrated learning center for Korean and Korean culture through Online
            </Text>
          </View>
          <Button onPress={openBottomSheet} className="w-full">
            <Text>Sign in with Kindo Account</Text>
          </Button>
          <Button
            variant="neutral"
            onPress={openBottomSheet}
            className="w-full flex-row align-middle gap-2 items-center  flex justify-center"
          >
            <Image
              source={AppImages.google_icon}
              height={20}
              width={20}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
            <Text>Sign in with Google</Text>
          </Button>
        </View>
        <BottomSheet
          index={-1}
          enablePanDownToClose
          onChange={handleSheetChanges}
          ref={bottomSheetRef}
          backgroundStyle={{
            backgroundColor: isDarkColorScheme ? '#222' : '#fff',
            borderRadius: 20,
          }}
          onClose={() => {
            Keyboard.dismiss();
            setStep(ELoginScreen.LOGIN);
          }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              opacity={0.7}
            />
          )}
          style={{ marginTop: insets.top }}
        >
          <BottomSheetScrollView>
            <View className="gap-10 p-5 pt-0 pb-10" style={{ marginBottom: insets.top }}>
              {renderStep()}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
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
    color: '#222',
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
    backgroundColor: '#eee',
  },
  nextBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F59E42',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  prevText: { fontSize: 18, color: '#F59E42' },
  nextText: { fontSize: 18, color: '#fff', fontWeight: '500' },
});
