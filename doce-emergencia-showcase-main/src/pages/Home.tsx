
import { useEffect, useRef, useState } from "react";
import { Gift, User, TrendingUp, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionCard from "@/components/ActionCard";
import heroDoces from "@/assets/hero-doces.jpg";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const Home = () => {
  const navigate = useNavigate();
  const [usuarioLogado] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  // Autoplay do slider (3,5s)
  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      carouselApi.scrollNext();
    }, 3500);
    return () => clearInterval(id);
  }, [carouselApi]);

  const handleWhatsAppRedirect = () => {
    const message = "Olá! Quero fazer um pedido rápido dos deliciosos doces da Doce Emergência! ⚡";
    const whatsappUrl = `https://wa.me/5511976824710?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleMeuPerfilClick = () => {
    if (usuarioLogado) {
      navigate('/meu-perfil');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden shadow-2xl">
              <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
                <CarouselContent>
                  <CarouselItem>
                    <img
                      src={heroDoces}
                      alt="Deliciosos doces da Doce Emergência - Slide 1"
                      className="w-full h-40 md:h-56 object-cover"
                      loading="lazy"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img
                      src="/lovable-uploads/a4a13826-9001-4d9f-aae3-2ad87589ea6d.png"
                      alt="Promoções e novidades - Doce Emergência - Slide 2"
                      className="w-full h-40 md:h-56 object-cover"
                      loading="lazy"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img
                      src="/lovable-uploads/8756e0fa-396e-4224-9737-73def986814f.png"
                      alt="Lançamentos da semana - Doce Emergência - Slide 3"
                      className="w-full h-40 md:h-56 object-cover"
                      loading="lazy"
                    />
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Yellow Button with matching spacing */}
      <section className="container mx-auto px-4 mb-4 md:mb-6">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 text-lg md:text-xl font-bold py-8 md:py-10 h-auto shadow-lg transition-all duration-300 active:scale-95 rounded-xl"
          >
            ⚡ PEDIR AGORA
          </Button>
        </div>
      </section>

      {/* 2x2 Grid of White Cards with matching spacing */}
      <section className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <ActionCard
              title="VOTAÇÃO"
              icon={TrendingUp}
              variant="cream"
              onClick={() => navigate('/votacao')}
              className="w-full"
            />
            
            <ActionCard
              title="MEU PERFIL"
              icon={User}
              variant="cream"
              onClick={handleMeuPerfilClick}
              className="w-full"
            />
            
            <ActionCard
              title="RESGATAR CUPONS"
              icon={Gift}
              variant="cream"
              onClick={() => navigate('/cupons')}
              className="w-full"
            />
            
            <ActionCard
              title="SEJA UM FRANQUEADO"
              icon={Handshake}
              variant="cream"
              onClick={() => navigate('/franquia')}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-[#222] border border-[#FFD700] rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
            🍰 Doce Emergência
          </h2>
          <p className="text-white leading-relaxed text-sm md:text-base">
            Os melhores doces da cidade, direto na sua casa! 
            Faça seu pedido pelo WhatsApp e receba rapidinho.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
