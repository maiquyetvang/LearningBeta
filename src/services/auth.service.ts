import AsyncStorage from '@react-native-async-storage/async-storage';

// Prefix cho key
const AUTH_PREFIX = 'auth_';

/**
 * Type for authentication data
 */
export type AuthData = {
  email?: string;
  password?: string;
  isVerified?: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
  rememberMe?: boolean;
  userId?: string;
};

/**
 * Service for handling authentication data for multiple users
 */
class AuthStorage {
  /**
   * Get auth storage key for a user
   */
  private getAuthKey(userId: string): string {
    return `${AUTH_PREFIX}${userId}`;
  }

  /**
   * Save authentication data for a user
   */
  async saveAuth(userId: string, data: AuthData): Promise<void> {
    const key = this.getAuthKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Get authentication data for a user
   */
  async getAuth(userId: string): Promise<AuthData | null> {
    const key = this.getAuthKey(userId);
    const data = await AsyncStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as AuthData;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  }

  /**
   * Save credentials for a new login
   */
  async saveCredentials(
    userId: string,
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<void> {
    const data: AuthData = {
      email,
      userId,
      rememberMe,
    };

    // Only save password if rememberMe is true
    if (rememberMe) {
      data.password = password;
    }

    await this.saveAuth(userId, data);
  }

  /**
   * Save tokens for a user
   */
  async saveTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiryInSeconds: number,
  ): Promise<void> {
    const currentAuth = (await this.getAuth(userId)) || {};
    const tokenExpiry = Date.now() + expiryInSeconds * 1000;

    await this.saveAuth(userId, {
      ...currentAuth,
      accessToken,
      refreshToken,
      tokenExpiry,
    });
  }

  /**
   * Check if token is valid for a user
   */
  async isTokenValid(userId: string): Promise<boolean> {
    const auth = await this.getAuth(userId);

    if (!auth || !auth.accessToken || !auth.tokenExpiry) return false;

    return auth.tokenExpiry > Date.now();
  }

  /**
   * Remove auth data for a user
   */
  async removeAuth(userId: string): Promise<void> {
    const key = this.getAuthKey(userId);
    await AsyncStorage.removeItem(key);
  }
}

export const authStorage = new AuthStorage();
