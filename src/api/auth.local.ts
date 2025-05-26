import { LoginForm } from "../components/login/LoginScreen";
import accounts from "../data/accounts.json";

export const AUTH_KEY = "auth_state";

type AuthState = {
  isLoggedIn?: boolean;
  email?: string;
  message?: string;
  isSuccess?: boolean;
  confirmCode?: string;
};

export const authApi = {
  async login(loginForm: LoginForm): Promise<AuthState> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { email, password } = loginForm;
    const found = accounts.find(
      (acc) => acc.email === email && acc.password === password
    );
    if (!found) {
      throw new Error("Sai tài khoản hoặc mật khẩu");
    }
    return {
      isLoggedIn: true,
      email,
      isSuccess: true,
    };
  },
  async register(registerForm: LoginForm): Promise<AuthState> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { email, password } = registerForm;
    const found = accounts.find((acc) => acc.email === email);
    if (found) {
      return { isSuccess: false, message: "Email existed" };
    }
    accounts.push({ email, password });
    return {
      email,
      isSuccess: true,
      confirmCode: Math.floor(100000 + Math.random() * 900000).toString(),
    };
  },
};
