import { Progress } from "@/components/ui/progress";

interface QuickOrderProgressBarProps {
  progress: number;
}

const QuickOrderProgressBar = ({ progress }: QuickOrderProgressBarProps) => {
  return (
    <div className="mb-6">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div 
          className="h-full transition-all duration-500 ease-in-out" 
          style={{ 
            width: `${progress}%`,
            backgroundColor: '#49C861'
          }}
        />
      </div>
    </div>
  );
};

export default QuickOrderProgressBar;
