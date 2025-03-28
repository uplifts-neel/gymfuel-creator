
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const AchievementCard = ({ title, value, icon, className }: AchievementCardProps) => {
  return (
    <div 
      className={cn(
        "gym-card flex items-center gap-4 animate-scale-in border-l-4 border-coral",
        className
      )}
    >
      <div className="rounded-full p-3 bg-gradient-primary text-white">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default AchievementCard;
