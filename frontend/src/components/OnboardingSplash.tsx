import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { fetchTrackStats, type TrackStats } from '@/services/trackService';

interface OnboardingSplashProps {
  onComplete?: () => void;
}

const OnboardingSplash: React.FC<OnboardingSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [stats, setStats] = useState<TrackStats | null>(null);

  useEffect(() => {
    // Load stats data
    const loadStats = async () => {
      try {
        const statsData = await fetchTrackStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Set fallback stats if API fails
        setStats({
          total_tracks: 965,
          total_views: 529000000,
          unique_channels: 367,
          avg_views_per_track: 548000,
          total_likes: 7200000,
          avg_likes_per_track: 7461
        });
      }
    };

    loadStats();

    // Slower progress animation - 5 seconds instead of 3
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Show welcome message after progress completes
          setTimeout(() => {
            setShowWelcome(true);
            // Show enter button after welcome message appears
            setTimeout(() => setShowEnterButton(true), 1000);
          }, 800);
          return 100;
        }
        return prev + (100 / 100); // 100 frames over 5 seconds (assuming 50ms intervals)
      });
    }, 50); // Update every 50ms for smooth animation

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  // Generate particles for background effect
  const particles = Array.from({ length: 60 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }}
    />
  ));

  return (
    <div className={`onboarding-splash ${fadeOut ? 'fade-out' : ''}`}>
      {/* Particle Background */}
      <div className="particles-container">
        {particles}
      </div>

      {/* Animated Background Gradient */}
      <div className="background-gradient" />

      {/* Main Content */}
      <div className="splash-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-glow-wrapper">
            <img 
              src="/logo.png" 
              alt="Quantum Radio" 
              className="quantum-splash-logo"
              onError={(e) => {
                // Fallback to text if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="logo-text-fallback">
              Quantum Radio
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {!showWelcome && (
          <div className="progress-section">
            <div className="progress-container">
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
                <div className="progress-glow" style={{ left: `${progress}%` }} />
              </div>
              <div className="progress-text">{Math.round(progress)}%</div>
            </div>
            <div className="loading-text">
              Loading AI Music Collection...
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {showWelcome && (
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to Quantum Radio</h1>
            <p className="welcome-subtitle">
              Your AI-powered music experience awaits
            </p>
            <div className="welcome-description">
              {stats ? (
                `Discover ${stats.total_tracks.toLocaleString()} tracks from ${stats.unique_channels} channels with ${(stats.total_views / 1000000).toFixed(0)}M total views`
              ) : (
                'Discover amazing AI-generated music'
              )}
            </div>
            
            {/* Enter Button */}
            {showEnterButton && (
              <button 
                className="enter-button"
                onClick={handleEnter}
              >
                <Zap className="button-icon" />
                Enter Quantum Radio
                <ChevronRight className="button-arrow" />
              </button>
            )}
            
            <div className="welcome-glow" />
          </div>
        )}
      </div>

      <style>{`
        .onboarding-splash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at center, #0C0F1E 0%, #050812 50%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
          transition: opacity 0.6s ease-out;
        }

        .onboarding-splash.fade-out {
          opacity: 0;
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: radial-gradient(circle, #F4B843 0%, #2DB6FF 50%, transparent 70%);
          border-radius: 50%;
          animation: twinkle infinite ease-in-out;
          opacity: 0;
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }

        .background-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(244, 184, 67, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(45, 182, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 207, 255, 0.05) 0%, transparent 70%);
          animation: gradientShift 12s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 600px;
          padding: 2rem;
        }

        .logo-section {
          margin-bottom: 5rem;
        }

        .logo-glow-wrapper {
          position: relative;
          display: inline-block;
        }

        .quantum-splash-logo {
          height: 140px;
          width: auto;
          filter: 
            drop-shadow(0 0 20px rgba(244, 184, 67, 0.6))
            drop-shadow(0 0 40px rgba(45, 182, 255, 0.4))
            drop-shadow(0 0 60px rgba(0, 207, 255, 0.3));
          animation: logoGlow 4s ease-in-out infinite alternate;
        }

        .logo-text-fallback {
          display: none;
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #F4B843 0%, #2DB6FF 50%, #00CFFF 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          text-shadow: 0 0 30px rgba(244, 184, 67, 0.5);
          animation: logoGlow 4s ease-in-out infinite alternate;
        }

        @keyframes logoGlow {
          0% {
            filter: 
              drop-shadow(0 0 20px rgba(244, 184, 67, 0.6))
              drop-shadow(0 0 40px rgba(45, 182, 255, 0.4))
              drop-shadow(0 0 60px rgba(0, 207, 255, 0.3));
          }
          100% {
            filter: 
              drop-shadow(0 0 35px rgba(244, 184, 67, 0.9))
              drop-shadow(0 0 60px rgba(45, 182, 255, 0.7))
              drop-shadow(0 0 100px rgba(0, 207, 255, 0.6));
          }
        }

        .progress-section {
          width: 100%;
          max-width: 450px;
          animation: fadeInUp 1s ease-out;
        }

        .progress-container {
          margin-bottom: 2.5rem;
        }

        .progress-track {
          position: relative;
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, 
            #F4B843 0%, 
            #2DB6FF 50%, 
            #00CFFF 100%);
          border-radius: 5px;
          transition: width 0.1s ease-out;
          box-shadow: 
            0 0 25px rgba(244, 184, 67, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .progress-glow {
          position: absolute;
          top: -6px;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #00CFFF 0%, transparent 70%);
          border-radius: 50%;
          transform: translateX(-50%);
          animation: progressPulse 1.5s ease-in-out infinite;
        }

        @keyframes progressPulse {
          0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.3); }
        }

        .progress-text {
          margin-top: 1.5rem;
          font-size: 1.8rem;
          font-weight: 600;
          color: #F4B843;
          text-shadow: 0 0 15px rgba(244, 184, 67, 0.6);
        }

        .loading-text {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.8rem;
          animation: loadingDots 3s infinite;
          letter-spacing: 0.5px;
        }

        @keyframes loadingDots {
          0%, 20% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .welcome-section {
          animation: fadeInScale 1.2s ease-out;
          position: relative;
        }

        .welcome-title {
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #F4B843 0%, #2DB6FF 50%, #00CFFF 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 30px rgba(244, 184, 67, 0.3);
          animation: welcomeGlow 3s ease-in-out infinite alternate;
        }

        .welcome-subtitle {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
        }

        .welcome-description {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
          margin-bottom: 3rem;
          letter-spacing: 0.3px;
        }

        .enter-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #F4B843 0%, #2DB6FF 100%);
          border: none;
          border-radius: 50px;
          color: #000;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 20px rgba(244, 184, 67, 0.4),
            0 8px 40px rgba(45, 182, 255, 0.2);
          animation: enterButtonAppear 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }

        .enter-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 
            0 6px 25px rgba(244, 184, 67, 0.6),
            0 12px 50px rgba(45, 182, 255, 0.3);
        }

        .enter-button:active {
          transform: translateY(0) scale(1.02);
        }

        .enter-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: buttonShine 2s infinite;
        }

        @keyframes buttonShine {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }

        .button-icon {
          width: 20px;
          height: 20px;
          z-index: 1;
        }

        .button-arrow {
          width: 18px;
          height: 18px;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .enter-button:hover .button-arrow {
          transform: translateX(4px);
        }

        .welcome-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(244, 184, 67, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: welcomePulse 4s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes welcomeGlow {
          0% {
            text-shadow: 
              0 0 30px rgba(244, 184, 67, 0.3),
              0 0 60px rgba(45, 182, 255, 0.2);
          }
          100% {
            text-shadow: 
              0 0 40px rgba(244, 184, 67, 0.5),
              0 0 80px rgba(45, 182, 255, 0.3);
          }
        }

        @keyframes welcomePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes enterButtonAppear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .quantum-splash-logo {
            height: 100px;
          }

          .logo-text-fallback {
            font-size: 2.5rem;
          }

          .welcome-title {
            font-size: 2.8rem;
          }

          .welcome-subtitle {
            font-size: 1.1rem;
          }

          .welcome-description {
            font-size: 0.9rem;
          }

          .progress-text {
            font-size: 1.4rem;
          }

          .enter-button {
            padding: 0.9rem 1.8rem;
            font-size: 1rem;
          }

          .splash-content {
            padding: 1rem;
          }

          .logo-section {
            margin-bottom: 4rem;
          }
        }

        @media (max-width: 480px) {
          .quantum-splash-logo {
            height: 80px;
          }

          .logo-text-fallback {
            font-size: 2rem;
          }

          .welcome-title {
            font-size: 2.2rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .welcome-description {
            font-size: 0.85rem;
          }

          .progress-text {
            font-size: 1.2rem;
          }

          .enter-button {
            padding: 0.8rem 1.5rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingSplash; 