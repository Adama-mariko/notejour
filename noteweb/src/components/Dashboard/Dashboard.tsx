import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import type { User } from '../../types/User';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {

  const isAdmin = user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'administrateur';

  return isAdmin
    ? <AdminDashboard user={user} onLogout={onLogout} />
    : <UserDashboard user={user} onLogout={onLogout} />;
};

export default Dashboard;