import type { RegisterData, LoginData, LoginResponse } from "../types";
import type { User } from "../types/User";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {

  async register(userData: RegisterData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de l'inscription");
    }

    return data;
  },

  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la connexion");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Erreur logout:", err);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },


  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },
};
