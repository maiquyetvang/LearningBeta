import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
}
export const usePushNotification = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = React.useState<Notifications.ExpoPushToken | undefined>(
    undefined,
  );
  const [notification, setNotification] = React.useState<Notifications.Notification | undefined>(
    undefined,
  );

  const notificationListener = React.useRef<Notifications.Subscription>(null);
  const responseListener = React.useRef<Notifications.Subscription>(null);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice || true) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          showBadge: true,
        });
      }
      return token;
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotification(response.notification);
    });
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current!);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current!);
      }
    };
  }, []);

  return { expoPushToken, notification };
};
