import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
/**
 * Gửi local notification với nội dung tuỳ ý.
 * @param title Tiêu đề thông báo
 * @param body Nội dung thông báo
 * @param data Dữ liệu kèm theo (tuỳ chọn)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

/**
 * Gửi mã xác thực 6 số ngẫu nhiên qua local notification.
 * @returns mã code đã gửi
 */
export async function sendVerifyCodeNotification(confirmCode?: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await sendLocalNotification(
    "Your verification code",
    `Your code is: ${confirmCode || code}`,
    { code: confirmCode || code }
  );
  return code;
}
