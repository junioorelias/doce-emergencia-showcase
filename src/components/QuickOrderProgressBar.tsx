import { Progress } from "@/components/ui/progress";

interface QuickOrderProgressBarProps {
  progress: number;
}

const QuickOrderProgressBar = ({ progress }: QuickOrderProgressBarProps) => {
  return (
    <div className="mb-6">
      <Progress value={progress} className="h-2 bg-gray-200">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  );
};

export default QuickOrderProgressBar;
