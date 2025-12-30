export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    photo_profile?: string;
    role: 'admin' | 'user';
    created_at?: string;
}
