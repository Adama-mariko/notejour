import { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import WelcomeAnimation from './components/UI/WelcomeAnimation';
import Dashboard from './components/Dashboard/Dashboard';
import { authService } from './services/authService';
import type { User } from './types/User';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = (result: any) => {
    setUser(result.user);
    setShowWelcome(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout(); 
      setUser(null);              
      setCurrentView('login');    
      window.location.href = "/login"; 
    } catch (err: any) {
      console.error("Erreur lors de la déconnexion:", err);
      toast.error("Impossible de se déconnecter");
    }
  };

  const handleAnimationComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome && user) {
    return <WelcomeAnimation user={user} onAnimationComplete={handleAnimationComplete} />;
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <>
      <div className="App">
        {currentView === 'login' ? (
          <Login
            onSwitchToRegister={() => setCurrentView('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
