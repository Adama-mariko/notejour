import React from "react";
import type { Task } from "../../types";
// Import des icônes Material-UI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteIcon from '@mui/icons-material/Note';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DoneIcon from '@mui/icons-material/Done';
import VerifiedIcon from '@mui/icons-material/Verified';

interface TaskCardProps {
  task: Task;
  onValidate: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  showUser?: boolean;
}

const TaskCard = ({
  task,
  onValidate,
  onDelete,
  getStatusColor,
  getStatusIcon,
  showUser = false
}: TaskCardProps) => {
  // Fonction pour obtenir l'icône Material-UI selon le statut
  const getStatusIconMUI = (status: string) => {
    switch (status) {
      case 'à faire':
        return <HourglassEmptyIcon className="w-5 h-5" />;
      case 'en cours':
        return <PlayCircleIcon className="w-5 h-5" />;
      case 'terminé':
        return <DoneIcon className="w-5 h-5" />;
      case 'validé':
        return <VerifiedIcon className="w-5 h-5" />;
      default:
        return <AssignmentIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${getStatusColor(task.statut)}`}>
              {getStatusIconMUI(task.statut)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{task.titre}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.statut)}`}>
                {task.statut}
              </span>
            </div>
          </div>

          {showUser && task.user && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <PersonIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                Assigné à: <span className="font-medium">{task.user.prenom} {task.user.nom}</span>
              </span>
            </div>
          )}

          <p className="text-gray-600 mb-4">{task.description}</p>

          {task.note_utilisateur && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <NoteIcon className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Note de l'utilisateur:</p>
              </div>
              <p className="text-sm text-blue-700">{task.note_utilisateur}</p>
            </div>
          )}

          {task.valide_par_admin && (
            <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <div className="flex items-center gap-2">
                <VerifiedIcon className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-900">Tâche validée</p>
              </div>
              {task.date_validation && (
                <p className="text-xs text-green-700 mt-1 ml-6">
                  Validée le: {new Date(task.date_validation).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CalendarTodayIcon className="w-4 h-4" />
              <span>{new Date(task.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <BadgeIcon className="w-4 h-4" />
              <span>#{task.id}</span>
            </div>
            {task.updated_at && (
              <div className="flex items-center gap-1">
                <span>✏️</span>
                <span>Modifié: {new Date(task.updated_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {task.statut === 'terminé' && !task.valide_par_admin && (
            <button
              onClick={() => onValidate(task.id)}
              className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="Valider la tâche"
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Valider</span>
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors duration-200 flex items-center gap-2"
            title="Supprimer la tâche"
          >
            <DeleteIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;