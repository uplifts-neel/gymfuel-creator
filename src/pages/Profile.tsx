
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Award, Settings, Mail, Phone, Edit } from 'lucide-react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import ProfileSection from '@/components/ProfileSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Profile = () => {
  const navigate = useNavigate();
  
  // Use local storage to persist profile data
  const [profileData, setProfileData] = useLocalStorage('profile', {
    name: "John Sharma",
    email: "john@dronacharyagym.com",
    phone: "+91 9876543210",
    achievements: "Professional Fitness Trainer, 10+ Years Experience, Certified Nutritionist, Fitness Competition Judge",
    photoUrl: "",
  });

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editName, setEditName] = useState(profileData.name);
  const [editEmail, setEditEmail] = useState(profileData.email);
  const [editPhone, setEditPhone] = useState(profileData.phone);
  
  const handleProfileUpdate = (data: { name: string; achievements: string; photoUrl?: string }) => {
    setProfileData({
      ...profileData,
      name: data.name,
      achievements: data.achievements,
      photoUrl: data.photoUrl || profileData.photoUrl,
    });
  };

  const toggleContactEdit = () => {
    if (isEditingContact) {
      // Save contact info
      setProfileData({
        ...profileData,
        name: editName,
        email: editEmail,
        phone: editPhone,
      });
    }
    setIsEditingContact(!isEditingContact);
  };

  // Split achievements into array for display
  const achievementsList = profileData.achievements.split(',').map(item => item.trim()).filter(Boolean);

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
        
        <div className="relative">
          <ProfileSection
            name={profileData.name}
            achievements={profileData.achievements}
            photoUrl={profileData.photoUrl}
            editable={true}
            onUpdate={handleProfileUpdate}
          />
        </div>
        
        <Card className="mb-6 p-4 animate-scale-in relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium flex items-center text-coral">
              <Mail size={16} className="mr-2" />
              Contact Information
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleContactEdit}
              className="h-8 w-8"
            >
              <Edit size={16} className={isEditingContact ? "text-coral" : "text-muted-foreground"} />
            </Button>
          </div>
          <Separator className="mb-3" />
          
          {isEditingContact ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-md"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Phone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-md"
                />
              </div>
              <Button 
                onClick={toggleContactEdit} 
                className="w-full bg-coral hover:bg-coral/90 mt-2"
              >
                Save Contact Info
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-muted-foreground min-w-[80px]">Name:</span>
                <span>{profileData.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground min-w-[80px]">Email:</span>
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground min-w-[80px]">Phone:</span>
                <span>{profileData.phone}</span>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-4 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-medium mb-3 flex items-center text-coral">
            <Award size={16} className="mr-2" />
            Achievements
          </h3>
          <Separator className="mb-3" />
          <ul className="space-y-2">
            {achievementsList.map((achievement, index) => (
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
