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
          <h1 className="text-4xl md:text-5xl font-bold text-doce-white text-center mb-12 md:mb-16">
            Nossa História
          </h1>

          {/* Story Content */}
          <div className="bg-doce-white rounded-2xl p-8 md:p-12 shadow-xl mb-8">
            {/* Opening Statement */}
            <div className="mb-16">
              <p className="text-2xl md:text-3xl font-bold text-doce-brown leading-relaxed text-center">
                Uma ideia simples. Uma visão clara. E um momento que mudou tudo.
              </p>
            </div>

            {/* First Block */}
            <div className="mb-12">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed mb-8">
                A Doce Emergência nasce na primeira mordida dada no brigadeiro certo — aquele instante que lembra todo mundo de como a vida fica mais leve quando o doce certo aparece na hora exata.
              </p>
              
              <div className="my-8 pl-6 border-l-4 border-doce-yellow">
                <p className="text-xl md:text-2xl font-semibold text-doce-brown italic">
                  A pergunta veio na sequência:<br />
                  "Como posso compartilhar esse sentimento?"
                </p>
              </div>
            </div>

            {/* Second Block */}
            <div className="mb-12">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                Daí surgiu o projeto. Daquela primeira mordida no brigadeiro de amendoim, nasceu a base de uma marca com identidade forte, qualidade e a missão de entregar esse suspiro que todos merecem no meio da rotina.
              </p>
            </div>

            {/* Third Block */}
            <div className="mb-12">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed mb-6">
                O projeto cresce com estratégia, autenticidade e a convicção de que o simples, quando bem-feito, conquista. Logo ficou evidente:
              </p>
              
              <div className="bg-doce-yellow/10 rounded-xl p-6 mb-6">
                <p className="text-lg md:text-xl font-semibold text-doce-brown">
                  Nossos clientes buscam mais do que sabor.
                </p>
              </div>
              
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                Se trata de criar boas memórias e compartilhar momentos de prazer.
              </p>
            </div>

            {/* Fourth Block */}
            <div className="mb-0">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed mb-6">
                Hoje, a Doce Emergência existe para isso:
              </p>
              
              <p className="text-xl md:text-2xl font-bold text-doce-brown leading-relaxed">
                ser a pausa rápida em meio ao caos, atendendo cada "emergência" com o alívio imediato de uma mordida inesquecível.
              </p>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-doce-white rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-doce-brown mb-10 text-center">
              Fundador — A mente por trás da marca
            </h2>
            
            <div className="flex flex-col items-center">
              {/* Founder Name */}
              <div className="mb-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-doce-brown mb-2">
                  Elias
                </h3>
              </div>
              
              {/* Founder Story */}
              <div className="space-y-8">
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
