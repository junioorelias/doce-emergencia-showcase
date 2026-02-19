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
            
            {/* 1 — Abertura com impacto */}
            <div className="mb-20">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-doce-brown leading-tight mb-6">
                A Doce Emergência nasceu<br className="hidden md:block" /> de uma ideia simples:
              </h1>
              <p className="text-lg md:text-xl text-doce-brown/80 leading-relaxed max-w-2xl">
                Levar doces tradicionais, de qualidade e com identidade afetiva<br className="hidden md:block" />
                a todas as pessoas que enxergam no doce<br className="hidden md:block" />
                um momento de conforto, celebração ou pausa no dia.
              </p>
            </div>

            {/* 2 — Bloco emocional */}
            <div className="mb-20 pl-6 border-l-4 border-doce-yellow">
              <p className="text-xl md:text-2xl text-doce-brown leading-loose">
                O doce não é apenas produto.<br />
                É memória.<br />
                É presente.<br />
                É cuidado.
              </p>
            </div>

            {/* 3 — Bloco institucional */}
            <div className="mb-20 space-y-6">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                Nossa missão é tornar os clássicos da confeitaria mais acessíveis,<br className="hidden md:block" />
                mantendo padrão, sabor e consistência.
              </p>
              <p className="text-base md:text-lg text-doce-brown/70 leading-relaxed">
                Trabalhamos com processos organizados,<br className="hidden md:block" />
                ingredientes selecionados<br className="hidden md:block" />
                e foco total na experiência do cliente.
              </p>
            </div>

            {/* 4 — Encerramento minimalista */}
            <div className="mb-0 pt-10 border-t border-doce-brown/10">
              <p className="text-base md:text-lg text-doce-brown/70 leading-relaxed">
                Em breve, atendimento 24h.<br />
                Porque algumas emergências não podem esperar —<br />
                especialmente as mais doces.
              </p>
            </div>

          </div>

          {/* Founder Section */}
          <div className="bg-doce-white rounded-2xl p-8 md:p-12 shadow-xl">
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-doce-brown mb-10 text-center">
              Nosso Fundador
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
                  A Doce Emergência é conduzida por um perfil criativo com base em design e produção audiovisual — alguém acostumado a construir marcas, organizar processos e pensar experiência do início ao fim.
                </p>
                
                <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                  A ideia não começou em um escritório. Começou no contato direto com as pessoas, testando sabores, ajustando detalhes e entendendo, na prática, o que realmente encanta. Cada interação serviu como termômetro para refinar produto, comunicação e posicionamento.
                </p>

                <p className="text-xl md:text-2xl text-doce-brown leading-loose">
                  O olhar estético virou padrão.<br />
                  A experiência virou método.
                </p>

                <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                  Hoje, a marca cresce com estrutura e direção clara — mantendo a mesma atenção aos detalhes que a fizeram ganhar espaço desde o primeiro dia.
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
