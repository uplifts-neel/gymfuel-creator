
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  LogOut, 
  Settings as SettingsIcon,
  User,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/Header';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="px-4 py-6">
        <h1 className="text-xl font-semibold mb-6">Settings</h1>
        
        {user && (
          <Card className="mb-6 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Avatar className="h-14 w-14 mr-4 bg-coral text-white">
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          {user?.role === 'owner' && (
            <Card className="animate-fade-in cursor-pointer" onClick={() => navigate('/register-trainer')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-turquoise/20 flex items-center justify-center mr-3">
                      <UserPlus size={20} className="text-turquoise" />
                    </div>
                    <div>
                      <h3 className="font-medium">Register Trainer</h3>
                      <p className="text-sm text-muted-foreground">Add a new trainer to the system</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="animate-fade-in cursor-pointer" onClick={() => navigate('/new-member')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-coral/20 flex items-center justify-center mr-3">
                    <Users size={20} className="text-coral" />
                  </div>
                  <div>
                    <h3 className="font-medium">Register Member</h3>
                    <p className="text-sm text-muted-foreground">Add a new gym member</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <SettingsIcon size={18} className="mr-2 text-muted-foreground" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <NavigationBar />
    </div>
  );
};

export default Settings;
