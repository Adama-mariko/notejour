import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { taskService } from "../../services/taskService";
import type { Task } from "../../types/Task";
import type { User } from "../../types/User";
import CreateUserModal from "./CreateUserModal";
import logo from "../../assets/images/logo.jpg";
import TaskCard from "./TaskCard";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ titre: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    role: "user",
  });
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      console.log("🔄 Chargement des données initiales...");
      const [usersData, tasksData] = await Promise.all([
        taskService.getAllUsers(),
        taskService.getAllTasks()
      ]);
      
      console.log("✅ Users chargés:", usersData);
      setUsers(usersData || []);
      setAllTasks(tasksData || []);
      setError("");
    } catch (err: any) {
      console.error("❌ Erreur fetchInitialData:", err);
      setError(err.message || "Erreur de chargement des données");
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("🔄 Récupération des utilisateurs...");
      const usersData = await taskService.getAllUsers();
      console.log("✅ Utilisateurs reçus:", usersData);
      setUsers(usersData || []);
      setError("");
    } catch (err: any) {
      console.error("❌ Erreur fetchUsers:", err);
      setError(err.message || "Erreur lors de la récupération des utilisateurs");
      toast.error(err.message);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const tasksData = await taskService.getAllTasks();
      setAllTasks(tasksData || []);
    } catch (err: any) {
      console.error("Erreur fetchAllTasks:", err);
    }
  };

  const fetchUserTasks = async (userId: number) => {
    try {
      const tasks = await taskService.getUserTasks(userId);
      setUserTasks(tasks || []);
    } catch (err: any) {
      console.error("Erreur fetchUserTasks:", err);
    }
  };

  const handleUserSelect = (userItem: User) => {
    setSelectedUser(userItem);
    fetchUserTasks(userItem.id);
    setActiveTab("users");
  };

  const handleCreateTask = async () => {
    if (!selectedUser || !newTask.titre.trim()) {
      toast.error("Veuillez sélectionner un utilisateur et remplir le titre");
      return;
    }

    try {
      const createdTask = await taskService.createTask({
        user_id: selectedUser.id,
        titre: newTask.titre,
        description: newTask.description,
      });

      setUserTasks([createdTask, ...userTasks]);
      setNewTask({ titre: "", description: "" });
      toast.success(`Tâche assignée à ${selectedUser.prenom} avec succès`);
      fetchAllTasks();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleValidateTask = async (taskId: number) => {
    try {
      const updatedTask = await taskService.validateTask(taskId);
      setUserTasks(userTasks.map((task) => (task.id === taskId ? updatedTask : task)));
      setAllTasks(allTasks.map((task) => (task.id === taskId ? updatedTask : task)));
      toast.success("Tâche validée avec succès ✅");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    try {
      await taskService.deleteTask(taskId);
      setUserTasks(userTasks.filter((task) => task.id !== taskId));
      setAllTasks(allTasks.filter((task) => task.id !== taskId));
      toast.success("Tâche supprimée avec succès");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCreateUser = async () => {
    const { nom, prenom, email, telephone, password, role } = newUser;
    
    if (!nom || !prenom || !email || !telephone || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      console.log("🔄 Création d'utilisateur...");
      await taskService.createUser({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim().toLowerCase(),
        telephone: telephone.trim(),
        password: password,
        role: role || "user",
      });

      toast.success("✅ Utilisateur créé avec succès");
      setShowCreateUserModal(false);
      setNewUser({ 
        nom: "", 
        prenom: "", 
        email: "", 
        telephone: "", 
        password: "", 
        role: "user" 
      });
      
      await fetchUsers();
      
    } catch (err: any) {
      console.error("❌ Erreur création utilisateur:", err);
      toast.error(err.message || "Erreur lors de la création");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validé": return "bg-blue-100 text-blue-800";
      case "terminé": return "bg-green-100 text-green-800";
      case "en cours": return "bg-yellow-100 text-yellow-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validé": return "✅";
      case "terminé": return "🎯";
      case "en cours": return "🔄";
      default: return "⏳";
    }
  };

  const pendingValidationTasks = allTasks.filter(
    (t) => t.statut === "terminé" && !t.valide_par_admin
  );

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Tableau de bord";
      case "users": return "Gestion des utilisateurs";
      case "tasks": return "Toutes les tâches";
      case "pending": return "Tâches en attente";
      case "validated": return "Tâches validées";
      default: return "Tableau de bord";
    }
  };

  // SIDEBAR COMPONENT
  const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-1">
        {/* <div className="p-2 flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-25 w-auto rounded-2xl object-contain"
          />
        </div> */}
        
        <div className="mb-8 flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleAvatarClick}
          >
            {image ? (
              <img src={image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <PersonIcon className="w-8 h-8 text-white" />
            )}
          </div>

          <div className="text-center">
            <p className="font-medium">{user.prenom} {user.nom}</p>
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">Administrateur</span>
        </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>


        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === "dashboard" 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <DashboardIcon className="w-5 h-5" /> Tableau de bord
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === "users" 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <PeopleIcon className="w-5 h-5" /> Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === "tasks" 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <ListAltIcon className="w-5 h-5" /> Toutes les tâches
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === "pending" 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <PendingActionsIcon className="w-5 h-5" /> En attente
          </button>
          <button
            onClick={() => setActiveTab("validated")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === "validated" 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <CheckCircleIcon className="w-5 h-5" /> Validées
          </button>
        </nav>
      </div>

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
            <p className="text-sm text-gray-500">{user.email}</p>
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
      case "dashboard":
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-blue-100 rounded-lg">
                    <GroupsIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Utilisateurs</p>
                    <h3 className="text-3xl font-bold text-gray-800">{users.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-green-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-green-100 rounded-lg">
                    <ListAltIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Tâches Totales</p>
                    <h3 className="text-3xl font-bold text-gray-800">{allTasks.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-yellow-100 rounded-lg">
                    <ScheduleIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">En attente</p>
                    <h3 className="text-3xl font-bold text-gray-800">{pendingValidationTasks.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-purple-100 rounded-lg">
                    <VerifiedIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Validées</p>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {allTasks.filter((t) => t.valide_par_admin).length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {pendingValidationTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PendingActionsIcon className="w-5 h-5" /> Tâches en attente de validation
                </h2>
                <div className="space-y-4">
                  {pendingValidationTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{task.titre}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <button
                          onClick={() => handleValidateTask(task.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                        >
                          <CheckCircleIcon className="w-4 h-4" /> Valider
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "users":
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <PeopleIcon className="w-6 h-6" /> Gestion des utilisateurs
              </h2>
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <AddIcon className="w-5 h-5" /> Créer un utilisateur
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <PeopleIcon className="w-5 h-5" /> Utilisateurs ({users.length})
                </h3>
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun utilisateur</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((userItem) => (
                      <div
                        key={userItem.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedUser?.id === userItem.id 
                            ? "bg-blue-50 border-blue-300" 
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => handleUserSelect(userItem)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <PersonIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {userItem.prenom} {userItem.nom}
                            </h4>
                            <p className="text-sm text-gray-600">{userItem.email}</p>
                            <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                              userItem.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {userItem.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {selectedUser ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <AssignmentIcon className="w-5 h-5" /> Tâches de {selectedUser.prenom}
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        value={newTask.titre}
                        onChange={(e) => setNewTask({ ...newTask, titre: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Titre de la tâche..."
                      />
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        rows={3}
                        placeholder="Description..."
                      />
                      <button
                        onClick={handleCreateTask}
                        disabled={!newTask.titre.trim()}
                        className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          newTask.titre.trim()
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <AssignmentIcon className="w-5 h-5" /> Assigner la tâche
                      </button>
                    </div>

                    <div className="space-y-4">
                      {userTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Aucune tâche assignée</p>
                      ) : (
                        userTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onValidate={handleValidateTask}
                            onDelete={handleDeleteTask}
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                          />
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <PeopleIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Sélectionnez un utilisateur</h3>
                    <p className="text-gray-600">Cliquez sur un utilisateur pour gérer ses tâches</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ListAltIcon className="w-5 h-5" /> Toutes les tâches ({allTasks.length})
              </h2>
              {allTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune tâche créée</p>
              ) : (
                <div className="space-y-4">
                  {allTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onValidate={handleValidateTask}
                      onDelete={handleDeleteTask}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                      showUser={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "pending":
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <PendingActionsIcon className="w-5 h-5" /> Tâches en attente ({pendingValidationTasks.length})
              </h2>
              {pendingValidationTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune tâche en attente</p>
              ) : (
                <div className="space-y-4">
                  {pendingValidationTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onValidate={handleValidateTask}
                      onDelete={handleDeleteTask}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                      showUser={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "validated":
        const validatedTasks = allTasks.filter((t) => t.valide_par_admin);
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" /> Tâches validées ({validatedTasks.length})
              </h2>
              {validatedTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune tâche validée</p>
              ) : (
                <div className="space-y-4">
                  {validatedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onValidate={handleValidateTask}
                      onDelete={handleDeleteTask}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                      showUser={true}
                    />
                  ))}
                </div>
              )}
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
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <CreateUserModal
        visible={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default AdminDashboard;