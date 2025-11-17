import { Check, Sparkles, Users, Instagram, ShoppingBag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DescontosExclusivos = () => {
  const benefits = [
    { icon: Sparkles, text: "Oferta exclusiva toda semana" },
    { icon: ShoppingBag, text: "Até R$50 de economia no mês" },
    { icon: Users, text: "Acesso ao grupo VIP no WhatsApp" },
    { icon: Instagram, text: "Acesso ao Close Friends do Instagram" },
    { icon: Clock, text: "Prove novas receitas antes de todo mundo" }
  ];

  const handleSubscribe = () => {
    const message = encodeURIComponent("Olá! Gostaria de assinar o plano Membro Doce Emergência e ter acesso aos descontos exclusivos!");
    window.open(`https://wa.me/5511976824710?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-doce-white mb-4">
              Torne-se Membro Doce Emergência
            </h1>
            <p className="text-lg md:text-xl text-doce-white/90">
              Economize mais com descontos exclusivos no seu doce favorito.
            </p>
          </div>

          {/* Benefits Card */}
          <Card className="bg-doce-white p-6 md:p-8 mb-8 shadow-xl border-0">
            <h2 className="text-2xl font-bold text-doce-brown mb-6 text-center">
              Benefícios Exclusivos
            </h2>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-doce-yellow/20 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-doce-brown" />
                  </div>
                  <p className="text-doce-brown text-lg pt-2">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-doce-yellow/10 rounded-xl p-6 mb-6 text-center border-2 border-doce-yellow/30">
              <div className="mb-2">
                <span className="text-4xl font-bold text-doce-brown">R$ 0,99</span>
                <span className="text-doce-brown/70 ml-2">no primeiro mês</span>
              </div>
              <div className="text-doce-brown/70">
                Depois apenas <span className="font-bold text-doce-brown">R$ 5,90/mês</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleSubscribe}
              className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 text-xl font-bold py-8 h-auto shadow-lg transition-all duration-300 active:scale-95 rounded-xl"
            >
              ✨ Assinar Agora
            </Button>

            {/* Disclaimer */}
            <p className="text-center text-doce-brown/60 text-sm mt-4">
              Cancele quando quiser, sem complicações.
            </p>
          </Card>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 text-doce-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Sem taxas ocultas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Cancelamento imediato</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Suporte dedicado</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DescontosExclusivos;
