
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Award, Settings, Mail, Phone } from 'lucide-react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const navigate = useNavigate();
  
  // Sample profile data
  const profile = {
    name: "John Sharma",
    email: "john@dronacharyagym.com",
    phone: "+91 9876543210",
    achievements: [
      "Professional Fitness Trainer",
      "10+ Years Experience",
      "Certified Nutritionist",
      "Fitness Competition Judge"
    ],
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
        
        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-coral">
              <div className="text-4xl text-muted-foreground">
                {profile.name.charAt(0)}
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-turquoise hover:bg-turquoise/90"
            >
              <Camera size={14} />
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold">{profile.name}</h2>
        </div>
        
        <Card className="mb-6 p-4 animate-scale-in">
          <h3 className="font-medium mb-3 flex items-center text-coral">
            <Mail size={16} className="mr-2" />
            Contact Information
          </h3>
          <Separator className="mb-3" />
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-medium mb-3 flex items-center text-coral">
            <Award size={16} className="mr-2" />
            Achievements
          </h3>
          <Separator className="mb-3" />
          <ul className="space-y-2">
            {profile.achievements.map((achievement, index) => (
              <li 
                key={index} 
                className="flex items-center animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-2 w-2 rounded-full bg-turquoise mr-2" />
                {achievement}
              </li>
            ))}
          </ul>
        </Card>
      </main>

      <NavigationBar />
    </div>
  );
};

export default Profile;
