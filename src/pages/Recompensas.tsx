import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Star, Package, Percent, Gift } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  stock_quantity: number | null;
  image_url: string | null;
}

const Recompensas = () => {
  // Mock data - será substituído por integração real posteriormente
  const [rewards] = useState<Reward[]>([
    {
      id: "1",
      name: "Desconto de 10%",
      description: "Ganhe 10% de desconto em qualquer pedido",
      points_cost: 100,
      category: "desconto",
      stock_quantity: null,
      image_url: null,
    },
    {
      id: "2",
      name: "Doce Grátis",
      description: "Um doce especial por nossa conta",
      points_cost: 200,
      category: "produto",
      stock_quantity: 50,
      image_url: null,
    },
    {
      id: "3",
      name: "Frete Grátis",
      description: "Entrega grátis na sua próxima compra",
      points_cost: 150,
      category: "beneficio",
      stock_quantity: null,
      image_url: null,
    },
  ]);

  const userPoints = 250; // Mock - será dinâmico posteriormente

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'desconto':
        return <Percent className="h-5 w-5" />;
      case 'produto':
        return <Package className="h-5 w-5" />;
      case 'beneficio':
        return <Star className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'desconto':
        return 'bg-green-100 text-green-800';
      case 'produto':
        return 'bg-blue-100 text-blue-800';
      case 'beneficio':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-doce-yellow w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-10 w-10 text-doce-brown" />
          </div>
          <h1 className="text-3xl font-bold text-doce-brown mb-2">
            Catálogo de Recompensas
          </h1>
          <p className="text-doce-brown/80">
            Troque seus pontos por produtos e benefícios exclusivos
          </p>
        </div>

        {/* User Points */}
        <Card className="max-w-md mx-auto p-6 mb-8 bg-gradient-to-r from-doce-yellow/20 to-doce-yellow/10 border-doce-yellow/30">
          <div className="flex items-center justify-center space-x-3">
            <Coins className="h-8 w-8 text-doce-brown" />
            <div className="text-center">
              <p className="text-sm text-doce-brown/80">Seus Pontos</p>
              <p className="text-2xl font-bold text-doce-brown">{userPoints}</p>
            </div>
          </div>
        </Card>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(reward.category)}
                  <Badge className={getCategoryColor(reward.category)}>
                    {reward.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Pontos</p>
                  <p className="text-lg font-bold text-doce-brown">
                    {reward.points_cost}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-doce-brown mb-2">
                {reward.name}
              </h3>
              
              <p className="text-doce-brown/80 mb-4">
                {reward.description}
              </p>

              {reward.stock_quantity !== null && (
                <p className="text-sm text-gray-500 mb-4">
                  Estoque: {reward.stock_quantity} unidades
                </p>
              )}

              <div className="w-full bg-doce-yellow/10 text-doce-brown font-bold py-3 rounded-md text-center border-2 border-doce-yellow">
                Resgatar por {reward.points_cost} pontos
              </div>
            </Card>
          ))}
        </div>

        {rewards.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma recompensa disponível
            </h3>
            <p className="text-gray-500">
              Novas recompensas serão adicionadas em breve!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recompensas;