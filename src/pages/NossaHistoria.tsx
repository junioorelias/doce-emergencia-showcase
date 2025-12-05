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
          
          {/* Story Content */}
          <div className="bg-doce-white rounded-2xl p-8 md:p-12 shadow-xl mb-8">
            
            {/* Title H1 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-doce-brown leading-tight mb-16 md:mb-20 text-center">
              Mordida inesquecível
            </h1>

            {/* Bloco 1 — Introdução */}
            <div className="mb-16">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                A Doce Emergência nasce na primeira mordida dada no brigadeiro certo — aquele instante que lembra todo mundo de como a vida fica mais leve quando o doce certo aparece na hora exata.
              </p>
            </div>

            {/* Bloco 2 — Pergunta (destaque/citação) */}
            <div className="mb-16 pl-6 border-l-4 border-doce-yellow">
              <p className="text-xl md:text-2xl font-semibold text-doce-brown italic leading-relaxed">
                A pergunta veio na sequência:<br />
                "Como posso compartilhar esse sentimento?"
              </p>
            </div>

            {/* Bloco 3 — Desenvolvimento */}
            <div className="mb-16 space-y-8">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                Dai surgiu o projeto. Daquela primeira mordida no brigadeiro de amendoim, nasceu a base de uma marca com identidade forte, qualidade e a missão de entregar esse suspiro que todos merecem no meio da rotina.
              </p>
              
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                O projeto cresce com estratégia, autenticidade e a convicção de que o simples, quando bem-feito, conquista. Logo ficou evidente:
              </p>
            </div>

            {/* Bloco 4 — Destaque central */}
            <div className="mb-16 bg-doce-yellow/10 rounded-xl p-8 md:p-10">
              <p className="text-2xl md:text-3xl font-bold text-doce-brown text-center leading-relaxed">
                Nossos clientes buscam mais do que sabor.
              </p>
            </div>

            {/* Bloco 5 — Continuação */}
            <div className="mb-16">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                Se trata de criar boas memórias e compartilhar momentos de prazer.
              </p>
            </div>

            {/* Bloco 6 — Manifesto visual */}
            <div className="mb-0">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-doce-brown leading-relaxed text-center">
                Existimos para ser a pausa rápida no meio do caos, atendendo cada "emergência" com o alívio de uma mordida inesquecível.
              </p>
            </div>

          </div>

          {/* Founder Section */}
          <div className="bg-doce-white rounded-2xl p-8 md:p-12 shadow-xl">
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-doce-brown mb-10 text-center">
              A mente por trás da marca
            </h2>
            
            {/* Content with Photo on Left */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo Placeholder - Fixed Left */}
              <div className="flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
                <div className="w-48 aspect-[3/4] bg-doce-brown/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-doce-brown/40 text-sm text-center px-4">Foto do Fundador</span>
                </div>
                <div className="text-sm text-doce-brown text-center">
                  <span className="font-bold">Elias Junior</span>{" "}
                  <a 
                    href="https://instagram.com/junioorelias" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-doce-brown hover:text-doce-red transition-colors"
                  >
                    @junioorelias
                  </a>
                  <br />
                  <span className="italic">Fundador</span>
                </div>
              </div>
              
              {/* Text Content - Right Side */}
              <div className="flex-1 space-y-6">
                <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                  Movido por visão, intensidade e criatividade, Elias decidiu criar seu próprio negócio com personalidade. Deixando claro desde o início que seguiria seus instintos — sempre indo além da expectativa e convidando as pessoas a viver boas experiências.
                </p>
                
                <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                  Com uma abordagem inquieta e ambiciosa, ele acredita que grandes ideias podem nascer de momentos simples. Provando silenciosamente, que o impossível é apenas questão de opinião — principalmente quando se constrói algo com verdade.
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
