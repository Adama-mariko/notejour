import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from '../../types/User';
import type { Task } from '../../types/Task';
import { taskService } from '../../services/taskService';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DoneIcon from '@mui/icons-material/Done';
import VerifiedIcon from '@mui/icons-material/Verified';
import BadgeIcon from '@mui/icons-material/Badge';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const UserDashboard = ({ user, onLogout }: UserDashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasksData = await taskService.getMyTasks();
      setTasks(tasksData || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      setError('');
      toast.success('Statut mis à jour avec succès');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const openNoteModal = (task: Task) => {
    setSelectedTask(task);
    setNoteText(task.note_utilisateur || '');
    setShowNoteModal(true);
  };

  const submitNote = async () => {
    if (!selectedTask) return;

    try {
      const updatedTask = await taskService.submitTaskNote(selectedTask.id, noteText);
      setTasks(tasks.map(task =>
        task.id === selectedTask.id ? updatedTask : task
      ));
      toast.success('Note envoyée avec succès');
      setShowNoteModal(false);
      setSelectedTask(null);
      setNoteText('');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validé': return 'bg-blue-100 text-blue-800';
      case 'terminé': return 'bg-green-100 text-green-800';
      case 'en cours': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const completedTasks = tasks.filter(t => t.statut === 'terminé' || t.statut === 'validé').length;
  const inProgressTasks = tasks.filter(t => t.statut === 'en cours').length;
  const validatedTasks = tasks.filter(t => t.statut === 'validé').length;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Tableau de bord';
      case 'my-tasks': return 'Mes tâches';
      case 'completed': return 'Tâches terminées';
      case 'profile': return 'Mon profil';
      default: return 'Tableau de bord';
    }
  };

  // SIDEBAR COMPONENT
  const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <DashboardIcon /> TaskManager
        </h1>

        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <PersonIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium">{user.prenom} {user.nom}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <span className="text-xs bg-green-600 px-2 py-1 rounded-full">Utilisateur</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <DashboardIcon className="w-5 h-5" /> Tableau de bord
          </button>
          <button
            onClick={() => setActiveTab("my-tasks")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "my-tasks"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <AssignmentIcon className="w-5 h-5" /> Mes tâches
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <CheckCircleIcon className="w-5 h-5" /> Tâches terminées
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <PersonIcon className="w-5 h-5" /> Mon profil
          </button>
        </nav>
      </div>

      {/* Bouton Déconnexion en bas */}
      <div className="mt-auto p-6 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-lg hover:bg-red-600 bg-red-700 text-white flex items-center justify-center gap-3 transition-colors font-medium"
        >
          <LogoutIcon className="w-5 h-5" /> Déconnexion
        </button>
      </div>
    </div>
  );

  // NAVBAR COMPONENT
  const Navbar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <CalendarTodayIcon className="w-4 h-4" />
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-gray-800">{user.prenom} {user.nom}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <EmailIcon className="w-3 h-3" /> {user.email}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300">
            <PersonIcon className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total des tâches */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-blue-100 rounded-lg">
                    <AssignmentIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total des tâches</p>
                    <h3 className="text-3xl font-bold text-gray-800">{tasks.length}</h3>
                  </div>
                </div>
              </div>

              {/* Validées */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-green-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-green-100 rounded-lg">
                    <VerifiedIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Validées</p>
                    <h3 className="text-3xl font-bold text-gray-800">{validatedTasks}</h3>
                  </div>
                </div>
              </div>

              {/* Terminées */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-purple-100 rounded-lg">
                    <DoneIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Terminées</p>
                    <h3 className="text-3xl font-bold text-gray-800">{completedTasks}</h3>
                  </div>
                </div>
              </div>

              {/* En cours */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-yellow-100 rounded-lg">
                    <PlayCircleIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">En cours</p>
                    <h3 className="text-3xl font-bold text-gray-800">{inProgressTasks}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Tâches récentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AssignmentIcon className="w-5 h-5" /> Tâches récentes
              </h2>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <AssignmentIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune tâche assignée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{task.titre}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.statut)}`}>
                          {task.statut}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                      {task.valide_par_admin && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <VerifiedIcon className="w-4 h-4" /> Validée par l'admin
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'my-tasks':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <AssignmentIcon className="w-6 h-6" /> Mes tâches ({tasks.length})
              </h2>
              <button
                onClick={fetchTasks}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <AssignmentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune tâche assignée</h3>
                <p className="text-gray-600">L'administrateur vous assignera des tâches bientôt</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-lg ${getStatusColor(task.statut)}`}>
                          {task.statut === 'à faire' && <HourglassEmptyIcon className="w-5 h-5" />}
                          {task.statut === 'en cours' && <PlayCircleIcon className="w-5 h-5" />}
                          {task.statut === 'terminé' && <DoneIcon className="w-5 h-5" />}
                          {task.statut === 'validé' && <VerifiedIcon className="w-5 h-5" />}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-800 text-lg">{task.titre}</h3>
                          <p className="text-sm text-gray-600">ID: #{task.id}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{task.description}</p>

                    {task.note_utilisateur && (
                      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <p className="text-sm font-medium text-yellow-800 flex items-center gap-1">
                          <EditNoteIcon className="w-4 h-4" /> Votre note:
                        </p>
                        <p className="text-yellow-700 mt-1">{task.note_utilisateur}</p>
                      </div>
                    )}

                    {task.valide_par_admin && (
                      <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                        <p className="text-sm font-medium text-green-800 flex items-center gap-1">
                          <VerifiedIcon className="w-4 h-4" /> Tâche validée par l'admin
                        </p>
                        {task.date_validation && (
                          <p className="text-green-700 text-sm mt-1">
                            Validée le: {new Date(task.date_validation).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <CalendarTodayIcon className="w-4 h-4" />
                        Assigné le: {new Date(task.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      {task.updated_at && (
                        <span className="flex items-center gap-1">
                          ✏️ Modifié le: {new Date(task.updated_at).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(task.statut)}`}>
                        Statut: {task.statut}
                      </span>

                      {task.statut !== 'validé' && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => updateTaskStatus(task.id, 'à faire')}
                            className={`px-4 py-2 rounded-lg transition-colors ${task.statut === 'à faire'
                                ? 'bg-red-600 text-white'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                          >
                            À faire
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, 'en cours')}
                            className={`px-4 py-2 rounded-lg transition-colors ${task.statut === 'en cours'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                          >
                            En cours
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, 'terminé')}
                            className={`px-4 py-2 rounded-lg transition-colors ${task.statut === 'terminé'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                          >
                            Terminer
                          </button>
                          <button
                            onClick={() => openNoteModal(task)}
                            className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-2"
                          >
                            <EditNoteIcon className="w-4 h-4" />
                            {task.note_utilisateur ? 'Modifier note' : 'Ajouter note'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'completed':
        const completedTasksList = tasks.filter(t => t.statut === 'terminé' || t.statut === 'validé');
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" /> Tâches terminées ({completedTasksList.length})
              </h2>
              {completedTasksList.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune tâche terminée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedTasksList.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">{task.titre}</h3>
                          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.statut)}`}>
                          {task.statut}
                        </span>
                      </div>
                      {task.valide_par_admin && (
                        <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                          <VerifiedIcon className="w-4 h-4" />
                          Validée le {new Date(task.date_validation!).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <PersonIcon className="w-5 h-5" /> Mon profil
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <PersonIcon className="w-16 h-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{user.prenom} {user.nom}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-2">
                    {user.role}
                  </span>
                </div>

                {/* Informations */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="text-lg font-medium text-gray-800">{user.prenom} {user.nom}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <EmailIcon className="w-4 h-4" /> Email
                    </p>
                    <p className="text-lg font-medium text-gray-800">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" /> Téléphone
                    </p>
                    <p className="text-lg font-medium text-gray-800">{user.telephone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <BadgeIcon className="w-4 h-4" /> Rôle
                    </p>
                    <p className="text-lg font-medium text-gray-800 capitalize">{user.role}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">ID Utilisateur</p>
                    <p className="text-lg font-medium text-gray-800">{user.id}</p>
                  </div>

                  {user.created_at && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <CalendarTodayIcon className="w-4 h-4" /> Membre depuis
                      </p>
                      <p className="text-lg font-medium text-gray-800">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{getPageTitle()}</h2>
            <p>Contenu en développement...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Modal pour ajouter/modifier une note */}
      {showNoteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <EditNoteIcon className="w-5 h-5" /> Note pour: {selectedTask.titre}
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
              rows={4}
              placeholder="Décrivez le travail effectué, les difficultés rencontrées, vos suggestions..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setSelectedTask(null);
                  setNoteText('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Envoyer la note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;