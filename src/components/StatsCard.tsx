
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, icon, className }: StatsCardProps) => {
  return (
    <div 
      className={cn(
        "gym-card flex items-center gap-4 animate-scale-in",
        className
      )}
    >
      <div className="rounded-full p-3 bg-muted text-coral">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
