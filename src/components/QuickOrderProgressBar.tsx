import { Progress } from "@/components/ui/progress";

interface QuickOrderProgressBarProps {
  progress: number;
}

const QuickOrderProgressBar = ({ progress }: QuickOrderProgressBarProps) => {
  const getStepLabel = () => {
    if (progress <= 33) return "Escolha a categoria";
    if (progress <= 66) return "Monte seu carrinho";
    return "Finalize seu pedido";
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-doce-brown">{getStepLabel()}</span>
        <span className="text-sm font-medium text-doce-brown">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default QuickOrderProgressBar;
