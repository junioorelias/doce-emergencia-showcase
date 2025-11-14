import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Gift, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Cupons = () => {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
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
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/auth');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleResgatar = async () => {
    if (!codigo.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite um código para resgatar",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para resgatar cupons",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('redeem_coupon', {
        coupon_code: codigo.trim()
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
        setSucesso(true);
        toast({
          title: "🎉 " + result.message,
          description: `Você ganhou ${result.points_earned} pontos!`,
        });
        
        // Reset após 3 segundos
        setTimeout(() => {
          setSucesso(false);
          setCodigo("");
        }, 3000);
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
      setLoading(false);
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
            Resgatar Cupons
          </h1>
          <p className="text-doce-brown/80">
            Digite seu código e ganhe pontos incríveis!
          </p>
        </div>

        {/* Formulário */}
        <Card className="max-w-md mx-auto p-8 bg-doce-white shadow-xl">
          {!sucesso ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-doce-brown mb-2">
                  Código do Cupom
                </label>
                <Input
                  id="codigo"
                  type="text"
                  placeholder="Digite seu código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="text-center font-mono uppercase"
                  onKeyPress={(e) => e.key === 'Enter' && handleResgatar()}
                />
              </div>
              
              <Button
                onClick={handleResgatar}
                disabled={loading}
                className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  "Resgatar Cupom"
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600">
                Cupom Resgatado!
              </h3>
              <p className="text-doce-brown">
                Pontos adicionados ao seu perfil ✨
              </p>
            </div>
          )}
        </Card>

        {/* Dicas */}
        <div className="max-w-md mx-auto mt-8">
          <Card className="p-6 bg-doce-yellow/10">
            <h3 className="font-bold text-doce-brown mb-3">💡 Dicas</h3>
            <ul className="text-sm text-doce-brown/80 space-y-2">
              <li>• Códigos são válidos por tempo limitado</li>
              <li>• Acompanhe nossas redes sociais para novos cupons</li>
              <li>• Cada código pode ser usado apenas uma vez</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cupons;