
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Dumbbell, Plus, History as HistoryIcon } from 'lucide-react';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import ProfileSection from '@/components/ProfileSection';
import StatsCard from '@/components/StatsCard';
import QuickActionButton from '@/components/QuickActionButton';
import NavigationBar from '@/components/NavigationBar';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  // Sample data
  const profile = {
    name: "John Sharma",
    achievements: "Professional Fitness Trainer, 10+ Years Experience",
    photoUrl: ""
  };

  const stats = [
    { title: "Active Members", value: 120, icon: <Users size={24} /> },
    { title: "Trainers", value: 8, icon: <Dumbbell size={24} /> },
    { title: "Hours", value: "5AM - 10PM", icon: <Clock size={24} /> }
  ];

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="min-h-screen pb-16">
        <Header />
        
        <main className="px-4 py-6">
          <ProfileSection
            name={profile.name}
            achievements={profile.achievements}
            photoUrl={profile.photoUrl}
          />
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <QuickActionButton 
              label="New Plan" 
              icon={<Plus size={24} />} 
              onClick={() => navigate('/diet-plan')}
              variant="primary"
            />
            <QuickActionButton 
              label="History" 
              icon={<HistoryIcon size={24} />} 
              onClick={() => navigate('/history')}
              variant="secondary"
            />
          </div>
          
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold animate-fade-in">Statistics</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((stat, index) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
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
