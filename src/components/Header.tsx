
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("text-center py-4 bg-gradient-primary shadow-md", className)}>
      <h1 className="text-2xl font-bold text-white drop-shadow-md animate-fade-in">
        DRONACHARYA THE GYM
      </h1>
      <p className="text-sm text-white/90 mt-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Sant Nagar, Burari, Delhi-110036
      </p>
    </header>
  );
};

export default Header;
