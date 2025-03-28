
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(onComplete, 500); // Allow exit animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run once

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-darkBg transition-opacity duration-500",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-center">
        <div className="mb-4 text-5xl font-bold text-coral animate-pulse">
          DRONACHARYA
        </div>
        <div className="text-3xl font-semibold text-turquoise">THE GYM</div>
        <div className="mt-6 h-2 w-48 overflow-hidden rounded-full bg-muted mx-auto">
          <div 
            className="h-full bg-gradient-primary animate-pulse"
            style={{ 
              width: '100%',
              animation: 'pulse 1.5s ease-in-out infinite' 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
