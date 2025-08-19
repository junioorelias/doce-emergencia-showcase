import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Star, Gift, Settings, LogOut, Edit, Trophy, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

interface RedeemedCoupon {
  id: string;
  coupon_code: string;
  points_earned: number;
  redeemed_at: string;
}

const MeuPerfil = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [coupons, setCoupons] = useState<RedeemedCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadUserProfile(session.user.id);
      await loadUserCoupons(session.user.id);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/auth");
        } else if (session) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
          await loadUserCoupons(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error;
      }

      setProfile(profileData);
      setNewDisplayName(profileData?.display_name || user?.user_metadata?.display_name || '');
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadUserCoupons = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('redeemed_coupons')
        .select('*')
        .eq('user_id', userId)
        .order('redeemed_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error: any) {
      console.error('Error loading coupons:', error);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim() || !user) return;

    setRedeeming(true);

    try {
      const { data, error } = await supabase.rpc('redeem_coupon', {
        coupon_code: couponCode.trim()
      });

      if (error) {
        console.error('Error redeeming coupon:', error);
        toast({
          title: "Erro",
          description: "Erro ao resgatar cupom. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      const result = data as any;
      if (result.success) {
        toast({
          title: "🎉 " + result.message,
          description: `Você ganhou ${result.points_earned} pontos!`,
        });
        
        setCouponCode("");
        await loadUserProfile(user.id);
        await loadUserCoupons(user.id);
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !newDisplayName.trim()) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: newDisplayName.trim() })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas.",
      });

      setEditing(false);
      await loadUserProfile(user.id);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Até a próxima! 👋",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getUserLevel = (points: number) => {
    if (points >= 500) return { level: "Mestre Confeiteiro", icon: "🏆", color: "bg-amber-500" };
    if (points >= 200) return { level: "Doce Expert", icon: "⭐", color: "bg-blue-500" };
    if (points >= 50) return { level: "Amante de Doces", icon: "🍰", color: "bg-green-500" };
    return { level: "Iniciante", icon: "🌟", color: "bg-gray-500" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doce-yellow mx-auto mb-4"></div>
          <p className="text-doce-brown">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  const userLevel = getUserLevel(profile?.points || 0);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header do Perfil */}
        <Card className="p-8 mb-6 bg-gradient-to-r from-doce-yellow/20 to-doce-brown/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-doce-yellow w-20 h-20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-doce-brown" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {editing ? (
                <div className="flex gap-2 items-center justify-center md:justify-start">
                  <Input
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="max-w-xs"
                    placeholder="Seu nome"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdateProfile}
                    className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                  >
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-3xl font-bold text-doce-brown">
                    {profile?.display_name || 'Usuário'}
                  </h1>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(true)}
                    className="text-doce-brown/60 hover:text-doce-brown"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                <Badge className={`${userLevel.color} text-white`}>
                  {userLevel.icon} {userLevel.level}
                </Badge>
                <div className="flex items-center gap-1 text-doce-brown">
                  <Star className="h-5 w-5 text-doce-yellow fill-doce-yellow" />
                  <span className="font-bold text-xl">{profile?.points || 0}</span>
                  <span className="text-sm">pontos</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-doce-brown border-doce-brown hover:bg-doce-brown hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resgatar Cupons */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="h-6 w-6 text-doce-yellow" />
              <h2 className="text-xl font-bold text-doce-brown">Resgatar Cupom</h2>
            </div>
            
            <div className="space-y-4">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Digite o código do cupom"
                className="uppercase"
                maxLength={10}
              />
              
              <Button
                onClick={handleRedeemCoupon}
                disabled={!couponCode.trim() || redeeming}
                className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
              >
                {redeeming ? "Resgatando..." : "Resgatar Cupom"}
              </Button>
              
              <div className="text-xs text-doce-brown/60 mt-2">
                💡 Digite o código do cupom que você recebeu
              </div>
            </div>
          </Card>

          {/* Histórico de Cupons */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-doce-yellow" />
              <h2 className="text-xl font-bold text-doce-brown">Histórico de Cupons</h2>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {coupons.length === 0 ? (
                <p className="text-doce-brown/60 text-center py-8">
                  Nenhum cupom resgatado ainda
                </p>
              ) : (
                coupons.map((coupon) => (
                  <div key={coupon.id} className="flex justify-between items-center p-3 bg-doce-yellow/10 rounded-lg">
                    <div>
                      <p className="font-medium text-doce-brown">{coupon.coupon_code}</p>
                      <p className="text-xs text-doce-brown/60">
                        {new Date(coupon.redeemed_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      +{coupon.points_earned} pts
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Button
            onClick={() => navigate("/cupons")}
            variant="outline"
            className="p-6 h-auto flex-col gap-2 border-doce-yellow text-doce-brown hover:bg-doce-yellow/10"
          >
            <Gift className="h-8 w-8" />
            <span>Mais Cupons</span>
          </Button>
          
          <Button
            onClick={() => navigate("/recompensas")}
            variant="outline"
            className="p-6 h-auto flex-col gap-2 border-doce-yellow text-doce-brown hover:bg-doce-yellow/10"
          >
            <Trophy className="h-8 w-8" />
            <span>Recompensas</span>
          </Button>
          
          
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="p-6 h-auto flex-col gap-2 border-doce-yellow text-doce-brown hover:bg-doce-yellow/10"
          >
            <Home className="h-8 w-8" />
            <span>Início</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;