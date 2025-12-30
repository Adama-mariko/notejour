import type { Task } from "../types";
import type { User } from "../types/User";
import { authService } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class TaskService {
  private getHeaders(): HeadersInit {
    const token = authService.getToken();

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  logout() {
    authService.logout();
  }

  // ============= AUTH & ADMIN UTILISATEURS =============

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/auth/users`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la récupération des utilisateurs");
    }

    return await response.json();
  }

  async createUser(userData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    role: string;
  }): Promise<any> {
    try {
      console.log("🔄 Envoi création utilisateur...", userData);

      const response = await fetch(`${API_URL}/auth/admin/create-user`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      console.log("📡 Status:", response.status);
      console.log("📡 OK?:", response.ok);
      const responseText = await response.text();
      console.log("📡 Réponse texte:", responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("❌ Erreur parsing JSON:", parseError);
        throw new Error(`Réponse invalide du serveur: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        console.error("❌ Erreur détaillée du serveur:", data);
        throw new Error(data.error || data.message || `Erreur ${response.status}: création échouée`);
      }

      console.log("✅ Création réussie:", data);
      return data;

    } catch (error) {
      console.error("🔥 Erreur dans createUser:", error);
      throw error;
    }
  }

  // ============= ROUTES UTILISATEUR =============

  async getMyTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/user/tasks`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la récupération des tâches");
    }
    return await response.json();
  }

  async updateTaskStatus(taskId: number, status: string): Promise<Task> {
    const response = await fetch(`${API_URL}/api/user/tasks/${taskId}/status`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ statut: status }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la mise à jour");
    }
    return await response.json();
  }

  async submitTaskNote(taskId: number, note: string): Promise<Task> {
    const response = await fetch(`${API_URL}/api/user/tasks/${taskId}/note`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ note_utilisateur: note }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de l'envoi de la note");
    }
    return await response.json();
  }

  // ============= ROUTES ADMIN =============

  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/admin/tasks`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la récupération des tâches");
    }
    return await response.json();
  }

  async createTask(data: { user_id: number; titre: string; description: string }): Promise<Task> {
    const response = await fetch(`${API_URL}/api/admin/tasks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur création tâche");
    }
    return await response.json();
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/tasks`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la récupération des tâches");
    }
    return await response.json();
  }

  async updateTask(taskId: number, data: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_URL}/api/admin/tasks/${taskId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la mise à jour");
    }
    return await response.json();
  }

  async validateTask(taskId: number): Promise<Task> {
    const response = await fetch(`${API_URL}/api/admin/tasks/${taskId}/validate`, {
      method: "PUT",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la validation");
    }
    return await response.json();
  }

  async deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/admin/tasks/${taskId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || "Erreur lors de la suppression");
    }
  }
}

export const taskService = new TaskService();