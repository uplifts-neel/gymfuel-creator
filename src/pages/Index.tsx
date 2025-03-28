
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Plus, History as HistoryIcon, Star, Trophy, Medal } from 'lucide-react';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import ProfileSection from '@/components/ProfileSection';
import AchievementCard from '@/components/AchievementCard';
import QuickActionButton from '@/components/QuickActionButton';
import NavigationBar from '@/components/NavigationBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  
  // Get profile data from local storage
  const [profileData] = useLocalStorage('profile', {
    name: "John Sharma",
    achievements: "Professional Fitness Trainer, 10+ Years Experience",
    photoUrl: "",
    email: "john@dronacharyagym.com",
    phone: "+91 9876543210",
  });

  // Sample achievements data - replaced Certificate with Medal
  const achievements = [
    { title: "Certification", value: "ISSA Certified Trainer", icon: <Medal size={24} /> },
    { title: "Experience", value: "10+ Years", icon: <Star size={24} /> },
    { title: "Competitions", value: "25+ Judged", icon: <Trophy size={24} /> }
  ];

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleProfileUpdate = (data: { name: string; achievements: string; photoUrl?: string }) => {
    // This is handled in the Profile page component
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className="min-h-screen pb-16">
        <Header />
        
        <main className="px-4 py-6">
          <ProfileSection
            name={profileData.name}
            achievements={profileData.achievements}
            photoUrl={profileData.photoUrl}
            onUpdate={handleProfileUpdate}
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
