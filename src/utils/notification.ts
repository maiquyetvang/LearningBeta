import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export async function ensureNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return true;
}

/**
 * Send a local notification with custom content.
 * @param title Notification title
 * @param body Notification body
 * @param data Optional extra data
 */
export async function sendLocalNotification({
  title,
  body,
  data,
}: {
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  // const hasPermission = await ensureNotificationPermission();
  // if (!hasPermission) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null,
    // {
    //   type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    //   seconds: 2,
    // },
  });
}

/**
 * Send a 6-digit verification code via local notification.
 * @returns The code that was sent
 */
export async function sendVerifyCodeNotification(confirmCode?: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await sendLocalNotification({
    title: "Your verification code",
    body: `Your code is: ${confirmCode || code}`,
    data: { code: confirmCode || code },
  });
  return code;
}
