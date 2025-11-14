import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Star, Package, Percent, Gift, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  stock_quantity: number | null;
  image_url: string | null;
}

interface UserProfile {
  points: number;
}

const Recompensas = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await loadData(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/auth');
        } else {
          setUser(session.user);
          loadData(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async (userId: string) => {
    setLoading(true);
    try {
      // Load rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost');

      if (rewardsError) {
        console.error('Error loading rewards:', rewardsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar recompensas",
          variant: "destructive",
        });
        return;
      }

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('points')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil do usuário",
          variant: "destructive",
        });
        return;
      }

      setRewards(rewardsData || []);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    if (!user) return;

    setRedeeming(rewardId);
    try {
      const { data, error } = await supabase.rpc('redeem_reward', {
        reward_id: rewardId
      });

      if (error) {
        console.error('Error redeeming reward:', error);
        toast({
          title: "Erro",
          description: "Erro ao resgatar recompensa. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      const result = data as any;
      if (result.success) {
        toast({
          title: "🎉 " + result.message,
          description: `Você gastou ${result.points_spent} pontos!`,
        });
        
        // Reload data to update user points
        await loadData(user.id);
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-doce-brown" />
      </div>
    );
  }

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
        {userProfile && (
          <Card className="max-w-md mx-auto p-6 mb-8 bg-gradient-to-r from-doce-yellow/20 to-doce-yellow/10 border-doce-yellow/30">
            <div className="flex items-center justify-center space-x-3">
              <Coins className="h-8 w-8 text-doce-brown" />
              <div className="text-center">
                <p className="text-sm text-doce-brown/80">Seus Pontos</p>
                <p className="text-2xl font-bold text-doce-brown">{userProfile.points}</p>
              </div>
            </div>
          </Card>
        )}

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

              <Button
                onClick={() => handleRedeemReward(reward.id)}
                disabled={
                  !userProfile || 
                  userProfile.points < reward.points_cost ||
                  redeeming === reward.id ||
                  (reward.stock_quantity !== null && reward.stock_quantity <= 0)
                }
                className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold"
              >
                {redeeming === reward.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resgatando...
                  </>
                ) : userProfile && userProfile.points < reward.points_cost ? (
                  "Pontos Insuficientes"
                ) : reward.stock_quantity !== null && reward.stock_quantity <= 0 ? (
                  "Esgotado"
                ) : (
                  `Resgatar por ${reward.points_cost} pontos`
                )}
              </Button>
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