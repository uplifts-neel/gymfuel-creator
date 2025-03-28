
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSectionProps {
  name: string;
  achievements: string;
  photoUrl?: string;
  className?: string;
}

const ProfileSection = ({
  name,
  achievements,
  photoUrl,
  className,
}: ProfileSectionProps) => {
  return (
    <div className={cn("text-center py-6", className)}>
      <div className="relative mx-auto h-24 w-24 rounded-full bg-muted overflow-hidden border-4 border-coral animate-fade-in">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <User size={48} className="text-muted-foreground" />
          </div>
        )}
      </div>
      
      <h2 className="mt-4 text-xl font-semibold animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {name}
      </h2>
      
      <p className="mt-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {achievements}
      </p>
    </div>
  );
};

export default ProfileSection;
