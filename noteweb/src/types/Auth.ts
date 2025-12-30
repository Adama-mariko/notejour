import type { User } from "./User";

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
