import type { User } from "../../types/User";

interface NavbarProps {
    user: User;
    pageTitle: string;
    onNotificationClick?: () => void;
    notificationCount?: number;
}

const Navbar = ({ user, pageTitle, onNotificationClick, notificationCount = 0 }: NavbarProps) => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                {/* Page Title */}
                <div className="navbar-left">
                    <h1 className="page-title">{pageTitle}</h1>
                    <p className="page-subtitle">
                        {new Date().toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    {/* Notifications */}
                    <button
                        className="notification-btn"
                        onClick={onNotificationClick}
                    >
                        <span className="notification-icon">🔔</span>
                        {notificationCount > 0 && (
                            <span className="notification-badge">{notificationCount}</span>
                        )}
                    </button>

                    {/* User Profile Mini */}
                    <div className="navbar-profile">
                        <img
                            src={user.photo_profile}
                            alt={`${user.prenom} ${user.nom}`}
                            className="navbar-avatar"
                        />
                        <div className="navbar-user-info">
                            <span className="navbar-username">{user.prenom}</span>
                            <span className="navbar-role">{user.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
