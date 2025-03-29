
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, History as HistoryIcon, Star, Trophy, Medal, AlertCircle, CreditCard } from 'lucide-react';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import ProfileSection from '@/components/ProfileSection';
import AchievementCard from '@/components/AchievementCard';
import QuickActionButton from '@/components/QuickActionButton';
import NavigationBar from '@/components/NavigationBar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeeDue {
  id: string;
  due_date: string;
  member: {
    name: string;
    admission_number: string;
  };
}

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [dueFees, setDueFees] = useState<FeeDue[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sample achievements data - using Medal icon
  const achievements = [
    { title: "Certification", value: "ISSA Certified Trainer", icon: <Medal size={24} /> },
    { title: "Experience", value: "10+ Years", icon: <Star size={24} /> },
    { title: "Competitions", value: "25+ Judged", icon: <Trophy size={24} /> }
  ];

  // Use useEffect to handle splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch due fees
  useEffect(() => {
    if (user?.role === 'owner') {
      fetchDueFees();
    }
  }, [user]);

  const fetchDueFees = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('fees')
        .select(`
          id,
          due_date,
          member:members(name, admission_number)
        `)
        .eq('status', 'Due')
        .lte('due_date', today)
        .order('due_date', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      setDueFees(data || []);
    } catch (error) {
      console.error('Error fetching due fees:', error);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="min-h-screen pb-16">
        <Header />
        
        <main className="px-4 py-6">
          {user && (
            <ProfileSection
              name={user.name}
              achievements={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`}
              photoUrl=""
              onUpdate={() => {}}
            />
          )}
          
          {dueFees.length > 0 && user?.role === 'owner' && (
            <Card className="mt-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-red-700 dark:text-red-400">Payment Overdue</h3>
                    <ul className="mt-2 space-y-1">
                      {dueFees.map(fee => (
                        <li key={fee.id} className="text-sm">
                          {fee.member.name} ({fee.member.admission_number}) - Due: {new Date(fee.due_date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="link" 
                      className="p-0 mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 h-auto font-semibold"
                      onClick={() => navigate('/fees')}
                    >
                      View All Overdue Payments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <QuickActionButton 
              label="Diet Plan" 
              icon={<Plus size={24} />} 
              onClick={() => navigate('/diet-plan')}
              variant="primary"
            />
            {user?.role === 'owner' ? (
              <QuickActionButton 
                label="Fees" 
                icon={<CreditCard size={24} />} 
                onClick={() => navigate('/fees')}
                variant="secondary"
              />
            ) : (
              <QuickActionButton 
                label="History" 
                icon={<HistoryIcon size={24} />} 
                onClick={() => navigate('/history')}
                variant="secondary"
              />
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold flex items-center animate-fade-in">
              <Award size={20} className="mr-2 text-coral" />
              Achievements
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {achievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.title}
                  title={achievement.title}
                  value={achievement.value}
                  icon={achievement.icon}
                  className={{ animationDelay: `${index * 0.1}s` } as any}
                />
              ))}
            </div>
          </div>
        </main>

        <NavigationBar />
      </div>
    </>
  );
};

export default Index;
