import { Image } from 'react-native';
import { Button } from '../ui/button';
import { AppImages } from '~/assets/index';
import { useSystem } from '~/lib/powersync';
import { Text } from '../ui/text';

export default function SignInWithGoogleButton() {
  const { supabase } = useSystem();
  const handleSignInWithGoogle = async () => {
    try {
      await supabase.signinWithGoogle();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <Button
      variant="neutral"
      onPress={handleSignInWithGoogle}
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
  );
}
