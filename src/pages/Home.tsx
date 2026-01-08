import { useEffect, useState } from "react";
import { TrendingUp, Gift, BookOpen, Handshake, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ActionCard from "@/components/ActionCard";
import bannerRequeijao from "@/assets/banner-requeijao.jpg";
import bannerBrigadeiro from "@/assets/banner-brigadeiro.jpg";
import bannerCloseFriends from "@/assets/banner-closefriends.jpg";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import QuickOrderModal from "@/components/QuickOrderModal";

const Home = () => {
  const navigate = useNavigate();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);
    return () => clearInterval(id);
  }, [carouselApi]);

  const handleQuickOrder = () => {
    setQuickOrderOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden shadow-2xl">
              <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
                <CarouselContent>
                  <CarouselItem>
                    <img src={bannerRequeijao} alt="Super Requeijão - Mussarela Gratinada - Doce Emergência" className="w-full h-40 md:h-56 object-cover" fetchPriority="high" />
                  </CarouselItem>
                  <CarouselItem>
                    <img src={bannerBrigadeiro} alt="Tradicional Brigadeiro - Doce Emergência" className="w-full h-40 md:h-56 object-cover" />
                  </CarouselItem>
                  <CarouselItem>
                    <img src={bannerCloseFriends} alt="Descontos Exclusivos Close Friends - Doce Emergência" className="w-full h-40 md:h-56 object-cover" />
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-4 md:mb-6">
        <div className="max-w-2xl mx-auto">
          <Button onClick={handleQuickOrder} className="w-full bg-doce-yellow text-doce-brown hover:bg-doce-yellow/90 text-lg md:text-xl font-bold py-8 md:py-10 h-auto shadow-lg transition-all duration-300 active:scale-95 rounded-xl">
            FAZER PEDIDO RÁPIDO
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <ActionCard 
              title="FAVORITOS DA GALERA" 
              icon={TrendingUp} 
              variant="cream" 
              onClick={() => navigate('/fazer-pedido?filter=mais-pedidos')} 
              className="w-full" 
            />
            <ActionCard 
              title="DESCONTOS EXCLUSIVOS" 
              icon={Gift} 
              variant="cream" 
              onClick={() => navigate('/descontos-exclusivos')} 
              className="w-full" 
            />
            <ActionCard 
              title="NOSSA HISTÓRIA" 
              icon={BookOpen} 
              variant="cream" 
              onClick={() => navigate('/nossa-historia')} 
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

      <footer className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-doce-gray rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/a4a13826-9001-4d9f-aae3-2ad87589ea6d.png" 
                alt="Doce Emergência" 
                className="h-16 w-auto"
              />
            </div>

            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 text-doce-white/90 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Site Seguro</span>
              </div>
              <p className="text-doce-white/70 text-xs">
                Suas informações estão protegidas
              </p>
            </div>

            <div className="flex justify-center items-center gap-3 mb-4 pb-4 border-b border-doce-white/10">
              <CreditCard className="w-6 h-6 text-doce-white/70" />
              <span className="text-doce-white/70 text-sm">Pix</span>
              <span className="text-doce-white/70">•</span>
              <span className="text-doce-white/70 text-sm">Dinheiro</span>
              <span className="text-doce-white/70">•</span>
              <span className="text-doce-white/70 text-sm">Cartão</span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-doce-white/60 text-xs mb-3">
              <Link to="/politica-privacidade" className="hover:text-doce-white transition-colors">
                Política de Privacidade
              </Link>
              <span>•</span>
              <Link to="/termos-uso" className="hover:text-doce-white transition-colors">
                Termos de Uso
              </Link>
              <span>•</span>
              <a 
                href="https://wa.me/5511976824710" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-doce-white transition-colors"
              >
                Contato
              </a>
            </div>

            <p className="text-center text-doce-white/50 text-xs">
              © 2025-2026 Doce Emergência. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <QuickOrderModal open={quickOrderOpen} onOpenChange={setQuickOrderOpen} />
    </div>
  );
};

export default Home;
