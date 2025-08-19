import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Votacao = () => {
  const [usuarioLogado] = useState(false); // Simulação - integrar com auth depois
  const [votosRealizados, setVotosRealizados] = useState<string[]>([]);
  const { toast } = useToast();

  const enquetes = [
    {
      id: "combo-exclusivo",
      titulo: "Qual doce merece um combo exclusivo?",
      opcoes: [
        { id: "brigadeiro", nome: "Brigadeiro Gourmet", votos: 45 },
        { id: "bolo-colher", nome: "Bolo de Colher", votos: 32 },
        { id: "brownie", nome: "Brownie Premium", votos: 28 },
        { id: "torta", nome: "Torta da Casa", votos: 15 }
      ]
    },
    {
      id: "sabor-volta",
      titulo: "Qual sabor deve voltar este mês?",
      opcoes: [
        { id: "maracuja", nome: "Maracujá com Chocolate", votos: 38 },
        { id: "coco", nome: "Coco Queimado", votos: 42 },
        { id: "morango", nome: "Morango Premium", votos: 25 },
        { id: "limao", nome: "Limão Siciliano", votos: 20 }
      ]
    }
  ];

  const handleVotar = (enqueteId: string, opcaoId: string) => {
    if (!usuarioLogado) {
      toast({
        title: "Login necessário",
        description: "Faça login para participar das votações",
        variant: "destructive",
      });
      return;
    }

    if (votosRealizados.includes(enqueteId)) {
      toast({
        title: "Voto já registrado",
        description: "Você já votou nesta enquete",
        variant: "destructive",
      });
      return;
    }

    setVotosRealizados([...votosRealizados, enqueteId]);
    toast({
      title: "🗳️ Voto registrado!",
      description: "Obrigado por participar da nossa enquete",
    });
  };

  const calcularPercentual = (votos: number, totalVotos: number) => {
    return totalVotos > 0 ? Math.round((votos / totalVotos) * 100) : 0;
  };

  const getTotalVotos = (opcoes: any[]) => {
    return opcoes.reduce((total, opcao) => total + opcao.votos, 0);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-doce-yellow w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-10 w-10 text-doce-brown" />
          </div>
          <h1 className="text-3xl font-bold text-doce-brown mb-2">
            Votação da Comunidade
          </h1>
          <p className="text-doce-brown/80">
            Sua opinião molda nosso cardápio! Vote nas enquetes ativas.
          </p>
        </div>

        {/* Status do usuário */}
        {!usuarioLogado && (
          <Card className="max-w-2xl mx-auto p-6 mb-8 bg-doce-yellow/10 border-doce-yellow/20">
            <div className="flex items-center gap-3 text-doce-brown">
              <Lock className="h-5 w-5" />
              <div>
                <p className="font-semibold">Faça login para votar</p>
                <p className="text-sm opacity-80">
                  Apenas usuários cadastrados podem participar das votações
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Enquetes */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {enquetes.map((enquete) => {
            const totalVotos = getTotalVotos(enquete.opcoes);
            const jaVotou = votosRealizados.includes(enquete.id);

            return (
              <Card key={enquete.id} className="p-8 bg-doce-white shadow-xl">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-doce-brown mb-2">
                    {enquete.titulo}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-doce-brown/60">
                    <Users className="h-4 w-4" />
                    <span>{totalVotos} votos até agora</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {enquete.opcoes.map((opcao) => {
                    const percentual = calcularPercentual(opcao.votos, totalVotos);
                    
                    return (
                      <div key={opcao.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-doce-brown">
                            {opcao.nome}
                          </span>
                          <div className="flex items-center gap-3">
                            {jaVotou && (
                              <span className="text-sm text-doce-brown/60">
                                {percentual}% ({opcao.votos})
                              </span>
                            )}
                            <Button
                              onClick={() => handleVotar(enquete.id, opcao.id)}
                              disabled={!usuarioLogado || jaVotou}
                              variant={jaVotou ? "secondary" : "default"}
                              size="sm"
                              className={jaVotou 
                                ? "bg-doce-brown/10 text-doce-brown" 
                                : "bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90"
                              }
                            >
                              {jaVotou ? "Votado" : "Votar"}
                            </Button>
                          </div>
                        </div>
                        
                        {jaVotou && (
                          <Progress 
                            value={percentual} 
                            className="h-2 bg-doce-brown/10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {jaVotou && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 text-center">
                      ✅ Obrigado pelo seu voto! Os resultados são atualizados em tempo real.
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Info adicional */}
        <Card className="max-w-2xl mx-auto mt-8 p-6 bg-doce-yellow/5">
          <h3 className="font-bold text-doce-brown mb-3">📊 Como funciona</h3>
          <ul className="text-sm text-doce-brown/80 space-y-2">
            <li>• Cada usuário pode votar uma vez por enquete</li>
            <li>• Resultados são atualizados em tempo real</li>
            <li>• Enquetes ficam ativas por tempo limitado</li>
            <li>• Sua opinião ajuda a definir nossos próximos lançamentos</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Votacao;