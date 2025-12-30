import type { User } from '../../types';
import logo from "../../assets/images/logo.jpg";


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'users' | 'all-tasks' | 'dashboard' | 'projects' | 'conference' | 'evaluation' | 'personnels' | 'historique' | 'faq') => void;
  onLogout: () => void;
  user: User;
}

const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  const navItems = [
    { name: 'Tableau de bord', key: 'dashboard', icon: '🏠' },
    { name: 'Personnels', key: 'personnels', icon: '👤', tabKeys: ['users'] },
    { name: 'Historique', key: 'historique', icon: '📜', tabKeys: ['all-tasks'] },
  ];

  const currentTabGroup = navItems.find(item => item.tabKeys?.includes(activeTab)) || navItems.find(item => item.key === activeTab);

  const isActive = (key: string) => {
    return currentTabGroup?.key === key || (currentTabGroup?.tabKeys && currentTabGroup.tabKeys.includes(activeTab) && key === currentTabGroup.key);
  };

  const handleTabChange = (key: string) => {
    if (key === 'personnels') setActiveTab('users');
    else if (key === 'historique') setActiveTab('all-tasks');
    else if (key === 'dashboard') setActiveTab('dashboard');

  };

  return (
    <div className="w-64 flex flex-col bg-white h-screen shadow-xl fixed top-0 left-0">
      <div className="p-2 bg-orange-600 h-[72px] flex items-center justify-center">
        <img
          src={logo}
          alt="Logo"
          className="h-full object-contain"
        />
      </div>


      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto pt-2">
        {navItems.map((item) => (
          <a
            key={item.key}
            onClick={() => handleTabChange(item.key as 'users' | 'all-tasks' | 'dashboard' | 'projects' | 'conference' | 'evaluation' | 'personnels' | 'historique' | 'faq')}
            className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200
              ${isActive(item.key) ? 'bg-orange-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </a>
        ))}
      </nav>

      {/* Footer / Paramètre & Déconnexion */}
      <div className="p-4 border-t border-gray-100">
        <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
          <span className="mr-3">⚙️</span> Paramètre
        </a>
        <a
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200 mt-2"
        >
          <span className="mr-3">➡️</span> Se déconnecter
        </a>
      </div>
    </div>
  );
};

export default Sidebar;