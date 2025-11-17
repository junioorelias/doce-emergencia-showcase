import { Heart, Target, Zap, Users } from "lucide-react";
import heroDoces from "@/assets/hero-doces.jpg";

const NossaHistoria = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroDoces} 
                alt="Doce Emergência - Nossa História" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-doce-brown/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-doce-white text-center mb-8 md:mb-12">
            Nossa História
          </h1>

          {/* Story Content */}
          <div className="bg-doce-white rounded-2xl p-6 md:p-10 shadow-xl mb-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-doce-yellow/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-doce-brown" />
              </div>
              <p className="text-doce-brown text-lg leading-relaxed pt-2">
                Em junho de 2023, um jovem empreendedor de 26 anos decidiu colocar à prova seus conhecimentos criando uma marca promissora. O sonho era simples, mas poderoso: trazer de volta aquele gostinho de infância, aquele doce que nos conecta com memórias afetivas.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-doce-yellow/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-doce-brown" />
              </div>
              <p className="text-doce-brown text-lg leading-relaxed pt-2">
                O propósito de conectar as pessoas à praticidade em encontrar aquele docinho favorito que carrega uma memória afetiva. Cada brigadeiro, cada bolo, cada doce é feito com carinho, pensando em proporcionar momentos especiais.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-doce-yellow/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-doce-brown" />
              </div>
              <p className="text-doce-brown text-lg leading-relaxed pt-2">
                A visão de tornar a entrega rápida e acessível a qualquer momento do dia. Seja uma emergência doce às 22h ou aquela vontade de tarde, estamos aqui para você. Nossa missão é estar sempre prontos quando você mais precisar.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-doce-yellow/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-doce-brown" />
              </div>
              <p className="text-doce-brown text-lg leading-relaxed pt-2">
                Hoje, nossa meta é expandir a marca, fortalecer a conexão emocional com nossos clientes e criar um impacto positivo na comunidade. Cada pedido nos motiva a continuar crescendo e levando felicidade de porta em porta.
              </p>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-doce-white rounded-2xl p-6 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-doce-brown mb-6 text-center">
              Sobre o Fundador
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Placeholder for founder photo */}
              <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-doce-yellow/20 flex items-center justify-center overflow-hidden">
                <Users className="w-16 h-16 text-doce-brown/40" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-doce-brown mb-2">
                  [Nome do Fundador]
                </h3>
                <p className="text-doce-brown/70 font-medium mb-3">
                  Empreendedor & Confeiteiro
                </p>
                <p className="text-doce-brown leading-relaxed">
                  Com 26 anos e movido pela paixão por empreender e criar experiências únicas, transformou um sonho em realidade. Acredita que cada doce tem o poder de criar conexões e despertar memórias especiais. Sua missão é levar felicidade através de sabores autênticos e atendimento excepcional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NossaHistoria;
