// Navbar.tsx
import React from 'react';
import type { User } from '../../types';
import adamaImage from "../../assets/images/adama.jpg";


interface NavbarProps {
  user: User;
  onAddTask: () => void;
}

const Navbar = ({ user, onAddTask }: NavbarProps) => {
  return (
    <div className="h-[72px] bg-white shadow-md flex justify-between items-center px-6 fixed top-0 right-0 left-64 z-10">
      {/* Barre de Recherche */}
      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-2 w-96">
        <span className="text-gray-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un projet / une tâche"
          className="bg-transparent outline-none w-full text-gray-700"
        />
      </div>

      {/* Actions et Profil */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onAddTask}
          className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <span className="text-xl mr-2">+</span> Ajouter
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 relative">
            🔔 {/* Remplacer par une icône si vous utilisez des librairies d'icônes */}
            {/* Petit badge rouge pour les notifications */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
        </button>
        <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
             <img
                src={adamaImage}
                alt="Utilisateur"
                className="h-full w-full object-cover"
               />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;