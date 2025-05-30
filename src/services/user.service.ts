import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "~/types/user.type";

// Thay thế khóa đơn lẻ bằng prefix
const USER_STORAGE_PREFIX = "app_user_";
const ACTIVE_USER_KEY = "app_active_user_id";
const USER_LIST_KEY = "app_user_list";

/**
 * Service for handling multiple users in local storage
 */
class UserStorage {
  /**
   * Save user data to storage
   */
  async saveUser(user: User): Promise<void> {
    if (!user._id) {
      throw new Error("User must have an _id to save");
    }

    // Lưu thông tin người dùng với key dựa trên ID
    const userKey = `${USER_STORAGE_PREFIX}${user._id}`;
    await AsyncStorage.setItem(userKey, JSON.stringify(user));

    // Thêm vào danh sách người dùng đã đăng nhập
    await this.addToUserList(user._id, user.email || "");

    // Đặt làm người dùng hiện tại
    await AsyncStorage.setItem(ACTIVE_USER_KEY, user._id);
  }

  /**
   * Add user to the list of saved users
   */
  private async addToUserList(userId: string, email: string): Promise<void> {
    const list = await this.getUserList();

    // Kiểm tra nếu đã tồn tại
    if (!list.some((user) => user.id === userId)) {
      list.push({ id: userId, email, lastLogin: new Date().toISOString() });
      await AsyncStorage.setItem(USER_LIST_KEY, JSON.stringify(list));
    } else {
      // Cập nhật thời gian đăng nhập gần nhất
      const updatedList = list.map((user) =>
        user.id === userId
          ? { ...user, lastLogin: new Date().toISOString() }
          : user
      );
      await AsyncStorage.setItem(USER_LIST_KEY, JSON.stringify(updatedList));
    }
  }

  /**
   * Get list of all saved users
   */
  async getUserList(): Promise<
    { id: string; email: string; lastLogin: string }[]
  > {
    const data = await AsyncStorage.getItem(USER_LIST_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing user list:", error);
      return [];
    }
  }

  /**
   * Get current active user ID
   */
  async getActiveUserId(): Promise<string | null> {
    return AsyncStorage.getItem(ACTIVE_USER_KEY);
  }

  /**
   * Switch to another saved user
   */
  async switchUser(userId: string): Promise<User | null> {
    // Kiểm tra xem người dùng có tồn tại không
    const userKey = `${USER_STORAGE_PREFIX}${userId}`;
    const userData = await AsyncStorage.getItem(userKey);

    if (!userData) return null;

    // Cập nhật người dùng hiện tại
    await AsyncStorage.setItem(ACTIVE_USER_KEY, userId);

    // Cập nhật thời gian đăng nhập gần nhất
    await this.addToUserList(userId, JSON.parse(userData).email || "");

    return this.getUser();
  }

  /**
   * Get current user data
   */
  async getUser(): Promise<User | null> {
    const activeUserId = await this.getActiveUserId();
    if (!activeUserId) return null;

    const userKey = `${USER_STORAGE_PREFIX}${activeUserId}`;
    const data = await AsyncStorage.getItem(userKey);

    if (!data) return null;

    try {
      return JSON.parse(data) as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  /**
   * Update specific user fields for active user
   */
  async updateUser(partialUser: Partial<User>): Promise<User | null> {
    const currentUser = await this.getUser();
    if (!currentUser || !currentUser._id) return null;

    const updatedUser = { ...currentUser, ...partialUser };
    await this.saveUser(updatedUser);

    return updatedUser;
  }

  /**
   * Remove specific user
   */
  async removeUser(userId: string): Promise<void> {
    // Xóa dữ liệu người dùng
    const userKey = `${USER_STORAGE_PREFIX}${userId}`;
    await AsyncStorage.removeItem(userKey);

    // Xóa khỏi danh sách
    const list = await this.getUserList();
    const updatedList = list.filter((user) => user.id !== userId);
    await AsyncStorage.setItem(USER_LIST_KEY, JSON.stringify(updatedList));

    // Nếu xóa người dùng hiện tại, đặt active user về null
    const activeId = await this.getActiveUserId();
    if (activeId === userId) {
      await AsyncStorage.removeItem(ACTIVE_USER_KEY);
    }
  }

  /**
   * Clear all user data
   */
  async clearAllUsers(): Promise<void> {
    const list = await this.getUserList();

    // Xóa từng người dùng
    for (const user of list) {
      const userKey = `${USER_STORAGE_PREFIX}${user.id}`;
      await AsyncStorage.removeItem(userKey);
    }

    // Xóa danh sách và active user
    await AsyncStorage.removeItem(USER_LIST_KEY);
    await AsyncStorage.removeItem(ACTIVE_USER_KEY);
  }

  /**
   * Log out current user but keep their data
   */
  async logoutCurrentUser(): Promise<void> {
    await AsyncStorage.removeItem(ACTIVE_USER_KEY);
  }
}

export const userStorage = new UserStorage();
