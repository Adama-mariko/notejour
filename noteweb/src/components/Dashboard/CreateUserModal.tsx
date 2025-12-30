import React, { useEffect, useRef, type FormEvent } from "react";

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
  newUser: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    role: string;
  };
  setNewUser: (user: any) => void;
  onSubmit: () => void;
}

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  autoComplete = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
  </div>
);

const CreateUserModal = ({
  visible,
  onClose,
  newUser,
  setNewUser,
  onSubmit,
}: CreateUserModalProps) => {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Fermer avec ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Focus auto sur le premier champ
  useEffect(() => {
    if (visible && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validation manuelle
    const { nom, prenom, email, telephone, password } = newUser;
    
    if (!nom.trim() || !prenom.trim() || !email.trim() || !telephone.trim() || !password.trim()) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (!/^\d{10}$/.test(telephone)) {
      alert("Le numéro de téléphone doit contenir exactement 10 chiffres");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }
    
    onSubmit();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 
      flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Créer un nouvel utilisateur
          </h3>

          <div className="space-y-4">
            {/* Ligne Nom + Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  label="Nom"
                  required
                  value={newUser.nom}
                  onChange={(e) =>
                    setNewUser({ ...newUser, nom: e.target.value })
                  }
                />
              </div>

              <div>
                <InputField
                  label="Prénom"
                  required
                  value={newUser.prenom}
                  onChange={(e) =>
                    setNewUser({ ...newUser, prenom: e.target.value })
                  }
                />
              </div>
            </div>

            <InputField
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <InputField
              label="Téléphone"
              type="tel"
              required
              autoComplete="tel"
              value={newUser.telephone}
              onChange={(e) =>
                setNewUser({ ...newUser, telephone: e.target.value })
              }
            />

            <InputField
              label="Mot de passe"
              type="password"
              required
              autoComplete="new-password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            {/* Select du rôle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle <span className="text-red-500">*</span>
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            {/* Messages d'info */}
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <p className="text-sm text-blue-700">
                • Le mot de passe doit contenir au moins 6 caractères<br/>
                • Le téléphone doit avoir 10 chiffres<br/>
                • L'email doit être valide
              </p>
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                text-white rounded-lg transition font-medium"
              >
                Créer l'utilisateur
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;