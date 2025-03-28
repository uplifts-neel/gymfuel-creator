
import { useState } from 'react';
import { User, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfileSectionProps {
  name: string;
  achievements: string;
  photoUrl?: string;
  className?: string;
  editable?: boolean;
  onUpdate?: (data: { name: string; achievements: string; photoUrl?: string }) => void;
}

const ProfileSection = ({
  name,
  achievements,
  photoUrl,
  className,
  editable = false,
  onUpdate,
}: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAchievements, setEditAchievements] = useState(achievements);
  const [editPhotoUrl, setEditPhotoUrl] = useState(photoUrl || '');
  const { toast } = useToast();

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      if (onUpdate) {
        onUpdate({
          name: editName,
          achievements: editAchievements,
          photoUrl: editPhotoUrl
        });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const nameInitial = name.charAt(0).toUpperCase();

  return (
    <div className={cn("text-center py-6", className)}>
      {editable && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10"
          onClick={handleEditToggle}
        >
          <Edit2 size={18} className={cn(isEditing ? "text-coral" : "text-muted-foreground")} />
        </Button>
      )}
      
      <div className="relative mx-auto animate-fade-in">
        <Avatar className="h-24 w-24 mx-auto border-4 border-coral">
          {photoUrl || editPhotoUrl ? (
            <AvatarImage 
              src={isEditing ? editPhotoUrl : photoUrl} 
              alt={name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-muted text-2xl">
              {nameInitial}
            </AvatarFallback>
          )}
        </Avatar>
        
        {isEditing && editable && (
          <div className="absolute -bottom-1 -right-1">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="rounded-full bg-turquoise p-2 text-white shadow-md hover:bg-turquoise/90 transition-colors">
                <User size={14} />
              </div>
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
      
      {isEditing && editable ? (
        <div className="mt-4 space-y-3 max-w-xs mx-auto">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-input rounded-md text-center"
            placeholder="Your name"
          />
          <textarea
            value={editAchievements}
            onChange={(e) => setEditAchievements(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-input rounded-md text-center min-h-[80px]"
            placeholder="Your achievements"
          />
          <Button 
            onClick={handleEditToggle} 
            className="w-full bg-coral hover:bg-coral/90"
          >
            Save Changes
          </Button>
        </div>
      ) : (
        <>
          <h2 className="mt-4 text-xl font-semibold animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {name}
          </h2>
          
          <p className="mt-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {achievements}
          </p>
        </>
      )}
    </div>
  );
};

export default ProfileSection;
