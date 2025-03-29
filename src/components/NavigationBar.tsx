
import { cn } from '@/lib/utils';
import { Home, UserCog, FileText, History, LogOut, PlusCircle, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const NavigationBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, isAuthenticated, user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Diet Plan', path: '/diet-plan', icon: FileText },
    { name: 'New Member', path: '/new-member', icon: PlusCircle },
    { name: 'Fees', path: '/fees', icon: CreditCard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: UserCog },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-card border-t border-border">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          // Hide New Member from bottom bar for non-owners
          if (item.name === 'New Member' && user?.role !== 'owner') {
            return null;
          }
          
          // Hide Fees from trainers
          if (item.name === 'Fees' && user?.role !== 'owner') {
            return null;
          }
          
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          if (item.name === 'Settings') {
            return (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex flex-col items-center p-2 transition-colors duration-200",
                    isActive 
                      ? "text-coral" 
                      : "text-muted-foreground hover:text-turquoise"
                  )}>
                    <Icon size={24} className={cn(isActive && "animate-scale-in")} />
                    <span className="text-xs mt-1">{item.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          
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
