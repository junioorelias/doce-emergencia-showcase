
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Increased delay for smoother transition
    }, 2500); // Increased duration to avoid flash

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: '#D2232A' }}
    >
      <div className="animate-fade-in animate-scale-in">
        <img 
          src="/lovable-uploads/8756e0fa-396e-4224-9737-73def986814f.png" 
          alt="Doce Emergência" 
          className="h-32 w-auto md:h-40"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
