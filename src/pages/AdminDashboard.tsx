import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Loader2,
  Eye,
  Copy,
  LogOut,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  points_value: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  stock_quantity: number | null;
  is_active: boolean;
}

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("coupons");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Form states
  const [couponForm, setCouponForm] = useState({
    name: '',
    description: '',
    points_value: '',
    max_uses: '',
    valid_until: ''
  });
  
  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    points_cost: '',
    category: '',
    stock_quantity: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar autenticação de admin primeiro
    const adminToken = localStorage.getItem('admin_session');
    if (adminToken !== 'authenticated') {
      navigate('/admin');
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await loadData();
    };

    checkAuth();
  }, [navigate]);

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session');
    toast({
      title: "Logout realizado",
      description: "Saindo do painel administrativo",
    });
    navigate('/');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar cupons
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (couponsError) {
        console.error('Error loading coupons:', couponsError);
        throw couponsError;
      }

      // Carregar recompensas
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (rewardsError) {
        console.error('Error loading rewards:', rewardsError);
        throw rewardsError;
      }

      setCoupons(couponsData || []);
      setRewards(rewardsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateCoupon = async () => {
    if (!couponForm.name || !couponForm.points_value) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e pontos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const code = generateCouponCode();
      const { error } = await supabase.from('coupons').insert({
        code,
        name: couponForm.name,
        description: couponForm.description,
        points_value: parseInt(couponForm.points_value),
        max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
        valid_until: couponForm.valid_until || null,
      });

      if (error) throw error;

      toast({
        title: "Cupom criado!",
        description: `Código: ${code}`,
      });

      setCouponForm({
        name: '',
        description: '',
        points_value: '',
        max_uses: '',
        valid_until: ''
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast({
        title: "Erro ao criar cupom",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleCreateReward = async () => {
    if (!rewardForm.name || !rewardForm.points_cost) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e custo em pontos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('rewards').insert({
        name: rewardForm.name,
        description: rewardForm.description,
        points_cost: parseInt(rewardForm.points_cost),
        category: rewardForm.category,
        stock_quantity: rewardForm.stock_quantity ? parseInt(rewardForm.stock_quantity) : null,
      });

      if (error) throw error;

      toast({
        title: "Recompensa criada!",
        description: `${rewardForm.name} foi adicionada`,
      });

      setRewardForm({
        name: '',
        description: '',
        points_cost: '',
        category: '',
        stock_quantity: ''
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating reward:', error);
      toast({
        title: "Erro ao criar recompensa",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Cupom ${!currentStatus ? 'ativado' : 'desativado'}`,
      });

      loadData();
    } catch (error) {
      console.error('Error updating coupon status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este cupom?")) return;
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) throw error;

      toast({
        title: "Cupom excluído",
        description: "O cupom foi removido com sucesso.",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Erro ao excluir cupom",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta recompensa?")) return;
    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;

      toast({
        title: "Recompensa excluída",
        description: "A recompensa foi removida com sucesso.",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: "Erro ao excluir recompensa",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const toggleRewardStatus = async (rewardId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({ is_active: !currentStatus })
        .eq('id', rewardId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Recompensa ${!currentStatus ? 'ativada' : 'desativada'}`,
      });

      loadData();
    } catch (error) {
      console.error('Error updating reward status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-doce-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4 py-8">
        {/* Header com logout */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-doce-brown">
                Painel Administrativo
              </h1>
              <p className="text-doce-brown/80">
                Gerenciar cupons e recompensas
              </p>
            </div>
          </div>
          <Button
            onClick={handleAdminLogout}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Button
              variant={activeTab === "coupons" ? "default" : "outline"}
              onClick={() => setActiveTab("coupons")}
              className={activeTab === "coupons" ? "bg-doce-yellow text-doce-brown" : ""}
            >
              Cupons
            </Button>
            <Button
              variant={activeTab === "rewards" ? "default" : "outline"}
              onClick={() => setActiveTab("rewards")}
              className={activeTab === "rewards" ? "bg-doce-yellow text-doce-brown" : ""}
            >
              Recompensas
            </Button>
          </div>
        </div>

        {/* Coupons Tab */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-doce-brown">Cupons</h2>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Cupom
              </Button>
            </div>

            {/* Form para criar cupom */}
            {showForm && (
              <Card className="p-6 bg-doce-white">
                <h3 className="text-lg font-bold text-doce-brown mb-4">Criar Novo Cupom</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={couponForm.name}
                      onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                      placeholder="Nome do cupom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Pontos *</Label>
                    <Input
                      id="points"
                      type="number"
                      value={couponForm.points_value}
                      onChange={(e) => setCouponForm({...couponForm, points_value: e.target.value})}
                      placeholder="Valor em pontos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_uses">Usos máximos</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={couponForm.max_uses}
                      onChange={(e) => setCouponForm({...couponForm, max_uses: e.target.value})}
                      placeholder="Deixe vazio para ilimitado"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valid_until">Válido até</Label>
                    <Input
                      id="valid_until"
                      type="datetime-local"
                      value={couponForm.valid_until}
                      onChange={(e) => setCouponForm({...couponForm, valid_until: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm({...couponForm, description: e.target.value})}
                      placeholder="Descrição do cupom"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleCreateCoupon}
                    className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                  >
                    Criar Cupom
                  </Button>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}

            {/* Lista de cupons */}
            <div className="grid gap-4">
              {coupons.map((coupon) => (
                <Card key={coupon.id} className="p-6 bg-doce-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-doce-brown">{coupon.name}</h3>
                        <Badge variant={coupon.is_active ? "default" : "secondary"}>
                          {coupon.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                          <span className="font-mono text-sm font-bold">{coupon.code}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast({ title: "Código copiado!" });
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-doce-brown/80 mb-2">{coupon.description}</p>
                      <div className="flex gap-4 text-sm text-doce-brown/70">
                        <span>Pontos: {coupon.points_value}</span>
                        <span>Usos: {coupon.current_uses}/{coupon.max_uses || '∞'}</span>
                        {coupon.valid_until && (
                          <span>Válido até: {new Date(coupon.valid_until).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                        variant="ghost"
                        size="sm"
                      >
                        {coupon.is_active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-doce-brown">Recompensas</h2>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Recompensa
              </Button>
            </div>

            {/* Form para criar recompensa */}
            {showForm && (
              <Card className="p-6 bg-doce-white">
                <h3 className="text-lg font-bold text-doce-brown mb-4">Criar Nova Recompensa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reward_name">Nome *</Label>
                    <Input
                      id="reward_name"
                      value={rewardForm.name}
                      onChange={(e) => setRewardForm({...rewardForm, name: e.target.value})}
                      placeholder="Nome da recompensa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="points_cost">Custo em pontos *</Label>
                    <Input
                      id="points_cost"
                      type="number"
                      value={rewardForm.points_cost}
                      onChange={(e) => setRewardForm({...rewardForm, points_cost: e.target.value})}
                      placeholder="Custo em pontos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={rewardForm.category}
                      onChange={(e) => setRewardForm({...rewardForm, category: e.target.value})}
                      placeholder="Categoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={rewardForm.stock_quantity}
                      onChange={(e) => setRewardForm({...rewardForm, stock_quantity: e.target.value})}
                      placeholder="Deixe vazio para ilimitado"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="reward_description">Descrição</Label>
                    <Textarea
                      id="reward_description"
                      value={rewardForm.description}
                      onChange={(e) => setRewardForm({...rewardForm, description: e.target.value})}
                      placeholder="Descrição da recompensa"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleCreateReward}
                    className="bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                  >
                    Criar Recompensa
                  </Button>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}

            {/* Lista de recompensas */}
            <div className="grid gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="p-6 bg-doce-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-doce-brown">{reward.name}</h3>
                        <Badge variant={reward.is_active ? "default" : "secondary"}>
                          {reward.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        {reward.category && (
                          <Badge variant="outline">{reward.category}</Badge>
                        )}
                      </div>
                      <p className="text-doce-brown/80 mb-2">{reward.description}</p>
                      <div className="flex gap-4 text-sm text-doce-brown/70">
                        <span>Custo: {reward.points_cost} pontos</span>
                        {reward.stock_quantity !== null && (
                          <span>Estoque: {reward.stock_quantity}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleRewardStatus(reward.id, reward.is_active)}
                        variant="ghost"
                        size="sm"
                      >
                        {reward.is_active ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDeleteReward(reward.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;