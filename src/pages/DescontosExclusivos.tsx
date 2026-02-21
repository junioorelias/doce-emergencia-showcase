import { Check, Sparkles, Users, Instagram, ShoppingBag, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerImg from "@/assets/banner-closefriends.jpg";

const DescontosExclusivos = () => {
  const benefits = [
    { icon: Sparkles, text: "Ofertas exclusivas toda semana" },
    { icon: ShoppingBag, text: "Economize até R$50 por mês" },
    { icon: Users, text: "Grupo VIP no WhatsApp" },
    { icon: Instagram, text: "Acesso ao Close Friends do Instagram" },
    { icon: Clock, text: "Prove novidades antes de todo mundo" },
  ];

  const handleSubscribe = () => {
    const message = encodeURIComponent(
      "Olá! Gostaria de assinar o plano Membro Doce Emergência e ter acesso aos descontos exclusivos!"
    );
    window.open(`https://wa.me/5511976824710?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-doce-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          
          {/* Hero Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="h-36 sm:h-auto">
              <img
                src={bannerImg}
                alt="Brigadeiros premium"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-6 bg-doce-brown text-doce-white">
              <p className="text-[10px] uppercase tracking-[0.2em] text-doce-white/60 mb-1">
                Programa exclusivo
              </p>
              <h1 className="text-lg sm:text-xl font-bold leading-tight mb-2">
                DESCONTOS EXCLUSIVOS
                <br />
                <span className="text-doce-green">CLOSE FRIENDS</span>
              </h1>
              <span className="inline-flex items-center self-start bg-doce-green text-doce-white text-xs font-bold px-3 py-1 rounded-full">
                R$ 0,99
              </span>
              <p className="text-[10px] text-doce-white/50 mt-1.5">
                Acesso imediato ao Grupo Exclusivo do WhatsApp.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-7 space-y-5">
            
            {/* Headline */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-doce-brown leading-snug">
                Mais do que descontos.{" "}
                <span className="text-doce-green">Close Friends é família.</span>
              </h2>
              <p className="text-xs sm:text-sm text-doce-brown/60 mt-2 max-w-md mx-auto">
                Descontos toda semana. Acesso antecipado aos lançamentos. Uma experiência especial para quem se identifica.
              </p>
            </div>

            {/* Benefits + Price side by side on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Benefits */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-doce-brown/50 font-semibold mb-2">
                  Benefícios de quem está por dentro
                </p>
                <ul className="space-y-2">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2.5 group">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-doce-green/10 flex items-center justify-center">
                        <b.icon className="w-3 h-3 text-doce-green" />
                      </span>
                      <span className="text-sm text-doce-brown/80 group-hover:text-doce-brown transition-colors">
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing + CTA */}
              <div className="flex flex-col justify-between">
                <div className="bg-doce-brown/[0.03] border border-doce-brown/[0.06] rounded-xl p-4 text-center mb-3">
                  <div className="mb-1">
                    <span className="text-3xl font-bold text-doce-brown">R$ 0,99</span>
                    <span className="text-doce-brown/50 text-xs ml-1">no primeiro mês</span>
                  </div>
                  <p className="text-doce-brown/50 text-xs">
                    Depois apenas <span className="font-bold text-doce-brown">R$ 5,90/mês</span>
                  </p>
                  <p className="text-[10px] text-doce-green font-medium mt-1.5">
                    Menos que um doce. Mais do que descontos.
                  </p>
                </div>

                {/* Trust */}
                <div className="flex justify-center gap-4 text-[10px] text-doce-green mb-3">
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> acesso imediato</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> cancelamento simples</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> sem taxas ocultas</span>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-doce-brown text-doce-white hover:bg-doce-brown/90 text-base font-bold py-5 h-auto rounded-xl transition-all duration-300 active:scale-[0.97]"
                >
                  <Star className="w-4 h-4 mr-1" /> Assinar Close Friends
                </Button>
                <p className="text-center text-doce-brown/40 text-[10px] mt-1.5">
                  Cancele quando quiser.
                </p>
              </div>
            </div>

            {/* Pertencimento */}
            <p className="text-center text-[11px] text-doce-brown/40 pt-1 border-t border-doce-brown/[0.06]">
              Você não está apenas economizando.{" "}
              <span className="text-doce-brown/60 font-medium">Está dizendo que faz parte do time.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescontosExclusivos;
