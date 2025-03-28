
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const QuickActionButton = ({
  label,
  icon,
  onClick,
  className,
  variant = 'primary',
}: QuickActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 h-auto p-4 animate-scale-in",
        variant === 'primary' ? 'bg-coral hover:bg-coral/90' : 'bg-turquoise hover:bg-turquoise/90',
        className
      )}
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
};

export default QuickActionButton;
