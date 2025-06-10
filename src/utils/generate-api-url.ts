import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  let origin = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  if (process.env.NODE_ENV === 'development') {
    const ip = Constants.expoGoConfig?.debuggerHost?.split(':')[0] ?? 'localhost';
    origin = `http://${ip}:${process.env.EXPO_PUBLIC_API_PORT}`;
  }
  return origin.concat(relativePath);
};
