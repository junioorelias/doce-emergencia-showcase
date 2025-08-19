
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  variant?: "yellow" | "cream";
}

const ActionCard = ({ 
  title, 
  icon: Icon, 
  onClick, 
  className = "",
  variant = "cream" 
}: ActionCardProps) => {
  const cardStyle = variant === "yellow" 
    ? "bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90" 
    : "bg-white text-doce-brown hover:bg-white/90";

  return (
    <Card 
      className={`${cardStyle} transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-0 shadow-xl ${className}`}
      onClick={onClick}
    >
      <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-32 md:h-40">
        <Icon className="h-8 md:h-12 w-8 md:w-12 mb-2 md:mb-4" />
        <h3 className="text-sm md:text-lg font-bold tracking-wide">{title}</h3>
      </div>
    </Card>
  );
};

export default ActionCard;
