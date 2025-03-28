
import { cn } from '@/lib/utils';
import { Home, User, FileText, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Diet Plan', path: '/diet-plan', icon: FileText },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-card border-t border-border">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 transition-colors duration-200",
                isActive 
                  ? "text-coral" 
                  : "text-muted-foreground hover:text-turquoise"
              )}
            >
              <Icon size={24} className={cn(isActive && "animate-scale-in")} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
