export interface Task {
  id: number;
  titre: string;
  description: string;
  statut: "à faire" | "en cours" | "terminé" | "validé";
  note_utilisateur?: string;
  valide_par_admin: boolean;
  date_validation?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  assigned_by_id?: number;
  user?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

