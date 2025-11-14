import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Handshake, Clock, Star, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Franquia = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cidade: ""
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.cidade) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simula envio dos dados
    setTimeout(() => {
      setEnviado(true);
      setLoading(false);
      toast({
        title: "🎉 Interesse registrado!",
        description: "Você receberá prioridade exclusiva por e-mail",
      });
    }, 2000);
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto p-12 text-center bg-doce-white shadow-xl">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-doce-brown mb-4">
              Interesse Registrado! 🎯
            </h1>
            
            <p className="text-lg text-doce-brown/80 mb-8 leading-relaxed">
              <strong>Seu interesse foi registrado.</strong> Assim que as primeiras 
              oportunidades forem liberadas, você receberá prioridade exclusiva por e-mail.
            </p>
            
            <div className="bg-doce-yellow/10 p-6 rounded-xl border border-doce-yellow/20">
              <p className="text-doce-brown font-medium">
                📧 Fique atento ao seu e-mail: <strong>{formData.email}</strong>
              </p>
            </div>
            
            <Button
              onClick={() => {
                setEnviado(false);
                setFormData({ nome: "", email: "", cidade: "" });
              }}
              variant="outline"
              className="mt-8"
            >
              Voltar ao Início
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header com Urgência */}
        <div className="text-center mb-12">
          <div className="bg-doce-yellow inline-flex items-center gap-2 px-4 py-2 rounded-full text-doce-brown font-semibold mb-4">
            🚀 EXCLUSIVO
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-doce-white mb-4 leading-tight">
            Torne-se um dos poucos parceiros da<br />
            <span className="text-doce-yellow">Doce Emergência!</span>
          </h1>
          
          <p className="text-xl text-doce-white/90 max-w-3xl mx-auto leading-relaxed">
            Ainda estamos estruturando a operação de franquias, mas já é possível entrar na lista de interessados.<br />
            Mostre que você leva isso a sério e será um dos primeiros a receber as novidades oficiais.
          </p>
        </div>

        {/* Destacadores de Autoridade */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="p-6 text-center bg-doce-white shadow-lg">
            <div className="bg-doce-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-doce-brown" />
            </div>
            <h3 className="font-bold text-doce-brown mb-2">Demanda Acelerada</h3>
            <p className="text-sm text-doce-brown/70">
              Crescimento orgânico e público fiel buscando nossos doces todos os dias.
            </p>
          </Card>
          
          <Card className="p-6 text-center bg-doce-white shadow-lg">
            <div className="bg-doce-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-doce-brown" />
            </div>
            <h3 className="font-bold text-doce-brown mb-2">Receita Exclusiva</h3>
            <p className="text-sm text-doce-brown/70">
              Produtos autorais com forte conexão emocional.
            </p>
          </Card>
          
          <Card className="p-6 text-center bg-doce-white shadow-lg">
            <div className="bg-doce-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-8 w-8 text-doce-brown" />
            </div>
            <h3 className="font-bold text-doce-brown mb-2">Mentoria Total</h3>
            <p className="text-sm text-doce-brown/70">
              Você não estará sozinho. Suporte estratégico e ferramentas, do início à operação.
            </p>
          </Card>
        </div>

        {/* Escassez e Seleção */}
        <Card className="max-w-2xl mx-auto p-8 bg-doce-white border-2 border-doce-yellow/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-doce-brown mb-4">
              ⏰ Critérios de Seleção
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-doce-brown rounded-full"></div>
                <span className="text-doce-brown">
                  <strong>Prioridade será dada aos primeiros interessados</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-doce-brown rounded-full"></div>
                <span className="text-doce-brown">
                  Apenas cadastros com <strong>real intenção</strong> serão considerados
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-doce-brown rounded-full"></div>
                <span className="text-doce-brown">
                  Análise de perfil e localização estratégica
                </span>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-doce-brown mb-2">
                Nome Completo *
              </label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="placeholder:text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-doce-brown mb-2">
                E-mail *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="placeholder:text-gray-500"
              />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-semibold text-doce-brown mb-2">
                Cidade *
              </label>
              <Input
                id="cidade"
                name="cidade"
                type="text"
                placeholder="Sua cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
                className="placeholder:text-gray-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 font-bold py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? "Enviando..." : "🚀 Entrar na Lista de Espera"}
            </Button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            * Ao enviar, você concorda em receber comunicações sobre oportunidades de franquia
          </p>
        </Card>

        {/* Footer de Credibilidade */}
        <div className="text-center mt-12">
          <p className="text-sm text-doce-brown/60">
            📈 Seja parte de uma marca que cresce 25% ao mês
          </p>
        </div>
      </div>
    </div>
  );
};

export default Franquia;