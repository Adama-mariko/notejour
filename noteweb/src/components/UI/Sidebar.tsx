import type { User } from "../../types/User";

interface SidebarProps {
    user: User;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const Sidebar = ({ user, activeTab, onTabChange, onLogout }: SidebarProps) => {
    const menuItems = user.role === "admin"
        ? [
            { id: "dashboard", label: "Tableau de bord", icon: "📊" },
            { id: "users", label: "Utilisateurs", icon: "👥" },
            { id: "tasks", label: "Toutes les tâches", icon: "📋" },
            { id: "pending", label: "En attente", icon: "⏳" },
            { id: "validated", label: "Validées", icon: "✅" },
        ]
        : [
            { id: "dashboard", label: "Tableau de bord", icon: "📊" },
            { id: "my-tasks", label: "Mes tâches", icon: "📝" },
            { id: "completed", label: "Terminées", icon: "🎯" },
            { id: "profile", label: "Mon profil", icon: "👤" },
        ];

    return (
        <div className="sidebar">
            {/* User Profile Section */}
            <div className="sidebar-profile">
                <div className="profile-avatar-wrapper">
                    <img
                        src={user.photo_profile}
                        alt={`${user.prenom} ${user.nom}`}
                        className="profile-avatar"
                    />
                    <div className={`status-indicator ${user.role === 'admin' ? 'admin' : 'user'}`}></div>
                </div>
                <div className="profile-info">
                    <h3 className="profile-name">{user.prenom} {user.nom}</h3>
                    <p className="profile-email">{user.email}</p>
                    <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? '👑 Administrateur' : '👤 Utilisateur'}
                    </span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onTabChange(item.id)}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-btn">
                    <span className="logout-icon">🚪</span>
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
