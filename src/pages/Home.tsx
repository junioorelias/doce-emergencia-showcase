import { useEffect, useState } from "react";
import { Gift, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionCard from "@/components/ActionCard";
import heroDoces from "@/assets/hero-doces.jpg";
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
    }, 3500);
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
                    <img src={heroDoces} alt="Deliciosos doces da Doce Emergência - Slide 1" className="w-full h-40 md:h-56 object-cover" loading="lazy" />
                  </CarouselItem>
                  <CarouselItem>
                    <img src="/lovable-uploads/a4a13826-9001-4d9f-aae3-2ad87589ea6d.png" alt="Promoções e novidades - Doce Emergência - Slide 2" className="w-full h-40 md:h-56 object-cover" loading="lazy" />
                  </CarouselItem>
                  <CarouselItem>
                    <img src="/lovable-uploads/8756e0fa-396e-4224-9737-73def986814f.png" alt="Lançamentos da semana - Doce Emergência - Slide 3" className="w-full h-40 md:h-56 object-cover" loading="lazy" />
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
            ⚡ PEDIR AGORA
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <ActionCard title="RECOMPENSAS" icon={Gift} variant="cream" onClick={() => navigate('/recompensas')} className="w-full" />
            <ActionCard title="SEJA UM FRANQUEADO" icon={Handshake} variant="cream" onClick={() => navigate('/franquia')} className="w-full" />
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-doce-brown/60 text-sm">© 2024 Doce Emergência. Todos os direitos reservados.</p>
        </div>
      </footer>

      <QuickOrderModal open={quickOrderOpen} onOpenChange={setQuickOrderOpen} />
    </div>
  );
};

export default Home;
