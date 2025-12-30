import React, { useEffect, useState } from 'react';

const WelcomeAnimation = ({ user, onAnimationComplete }) => {
  const [fireworks, setFireworks] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [showContent, setShowContent] = useState(false);

  const fullText = `Bienvenue ${user.prenom} ! 🎉\nVotre aventure extraordinaire commence maintenant.\nPréparez-vous à vivre une expérience unique qui\ntransformera votre quotidien en succès !`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setCurrentText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setShowContent(true);
          startFireworks();
        }, 500);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [fullText]);

  const startFireworks = () => {
    const createFirework = () => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 30 + 20;
      const duration = Math.random() * 2 + 1;
      
      return {
        id: Date.now() + Math.random(),
        left,
        top,
        size,
        duration,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      };
    };

    const interval = setInterval(() => {
      setFireworks(prev => [
        ...prev.slice(-20), 
        createFirework()
      ]);
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setTimeout(onAnimationComplete, 1000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Feux d'artifice */}
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute animate-ping rounded-full"
          style={{
            left: `${firework.left}%`,
            top: `${firework.top}%`,
            width: `${firework.size}px`,
            height: `${firework.size}px`,
            backgroundColor: firework.color,
            animationDuration: `${firework.duration}s`,
            opacity: 0.7
          }}
        />
      ))}

      {/* Contenu principal */}
      <div className="text-center text-white z-10">
        <div className={`transition-all duration-1000 ${showContent ? 'scale-110' : 'scale-100'}`}>
          <div className="text-6xl mb-8 animate-bounce">🎊</div>
          <pre className="text-2xl md:text-3xl font-bold whitespace-pre-line leading-relaxed">
            {currentText}
          </pre>
          {showContent && (
            <div className="mt-8 text-lg text-yellow-300 animate-pulse">
              Redirection vers votre dashboard...
            </div>
          )}
        </div>
      </div>

      {/* Effet de particules */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeAnimation;