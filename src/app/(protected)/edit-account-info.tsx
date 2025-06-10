import { useQuery } from "@powersync/react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import HeaderWithAction from "~/components/common/HeaderWithAction";
import PullToRefreshWrapper from "~/components/common/PullToRefreshWrapper";
import { AnimatedButton } from "~/components/custom-ui/animate-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useUpdateProfile } from "~/feature/profiles/hooks/use-update-profile";
import { useImageUpload } from "~/hooks/use-image-upload";
import { useGetMyProfile } from "~/hooks/use-my-profile";
import { Pencil } from "~/lib/icons/Pencil";
import { Trash2 } from "~/lib/icons/Trash2";
import { useAuthStore } from "~/stores/auth.store";
import { useLearningStore } from "~/stores/learning.store";

export default function EditAccount() {
  const insets = useSafeAreaInsets();
  const { resetLearning, clearInProgressLesson } = useLearningStore();
  const { profile, refetch } = useGetMyProfile();

  const { session, setUser, logout, profile: user } = useAuthStore();
  const [image, setImage] = React.useState<ImagePicker.ImagePickerAsset | null>(
    null
  );

  const [name, setName] = React.useState<string | undefined>(
    user?.full_name ?? undefined
  );

  const { upload, uploading } = useImageUpload({
    bucket: "avatars",
    onSuccess: async (publicUrl) => {
      await updateProfileAsync({ avatar_url: publicUrl });
    },
  });

  const [allowed, setAllowed] = React.useState(false);
  React.useEffect(() => {
    setAllowed(user?.full_name !== name || user?.avatar_url !== image);
  }, [name, image, user]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(protected)/(_tabs)/settings");
    }
  };
  const { updateProfileAsync } = useUpdateProfile({
    onSuccess: handleBack,
  });

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0]);
    }
  };
  const handleSave = async () => {
    try {
      if (!!name) {
        updateProfileAsync({
          full_name: name,
        });
      }
      if (!!image) {
        await upload({
          uri: image.uri,
        });
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // const handleSave = async () => {
  //   // setUser({ ...user, name, avatar });
  //   // await sendLocalNotification({
  //   //   title: "Profile Updated",
  //   //   body: "Your profile has been updated successfully.",
  //   // });
  //   handleBack();
  // };

  const handleDeleteAccount = () => {
    resetLearning();
    clearInProgressLesson();
    logout();
  };

  return (
    <SafeAreaView className='flex-1' style={{ paddingTop: insets.top }}>
      <PullToRefreshWrapper>
        <View className='flex-1 gap-5 px-5 pb-5'>
          <HeaderWithAction
            title='Edit Account'
            actionLabel='Save'
            onBack={handleBack}
            onAction={handleSave}
            disableAction={!allowed}
          />
          {/* Avatar */}

          <View className='items-center'>
            <View>
              <Image
                source={
                  image?.uri
                    ? { uri: image.uri }
                    : user?.avatar_url
                      ? user?.avatar_url
                      : require("assets/images/avatar-placeholder.png")
                }
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 50,
                  backgroundColor: "#eee",
                }}
              />
              <Pressable
                style={{
                  position: "absolute",
                  right: 31,
                  bottom: -10,
                  // backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 6,
                  elevation: 2,
                }}
                className='bg-foreground shadow-sm '
                // className='absolute bg-red-500 translate-x-1/2 left-1/2 bottom-0'
                onPress={handlePickAvatar}
              >
                <Pencil size={20} className='text-background' />
              </Pressable>
            </View>
          </View>
          {/* Form */}
          <View className='gap-5'>
            <View>
              <Text className='mb-1 font-semibold px-3'>Name</Text>
              <Input value={name} onChangeText={setName} />
            </View>
            <View>
              <Text className='mb-1 font-semibold px-3'>Email</Text>
              <Input value={session?.user.email} editable={false} />
            </View>
          </View>
          {/* Delete Account */}
          {/* <View className='flex-1 justify-end mt-10'>
          <Button
            variant='ghost'
            className='flex-row justify-center items-center'
          >
            <Trash2 size={18} color='#f00' />
            <Text className='!text-error ml-2'>Delete Account</Text>
          </Button>
        </View> */}
          {/* AlertDialog */}
          <AlertDialog className='mt-auto'>
            <Button variant='ghost'>
              <AlertDialogTrigger className='flex-row justify-center items-center'>
                <Trash2 size={18} color='#f00' />
                <Text className='!text-error ml-2'>Delete Account</Text>
              </AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete your account?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <Text>
                This action cannot be undone. All your learning data will be
                permanently deleted.
              </Text>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button
                    variant='outline'
                    // onPress={() => setShowDeleteDialog(false)}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant='destructive'
                    onPress={() => {
                      // setShowDeleteDialog(false);
                      handleDeleteAccount();
                    }}
                  >
                    <Text>Delete</Text>
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </PullToRefreshWrapper>
    </SafeAreaView>
  );
}
