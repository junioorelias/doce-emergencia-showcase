import { useEffect, useRef } from "react";
import historiaHero from "@/assets/historia-hero.jpg";
import historiaProcesso from "@/assets/historia-processo.jpg";
import founderPhoto from "@/assets/founder-elias.png";
import {
  Heart,
  Gift,
  Coffee,
  Award,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";

/* ─── tiny intersection-observer hook for scroll animations ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-8");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Divider = () => (
  <div className="flex items-center gap-4 my-16 md:my-24">
    <div className="flex-1 h-px bg-doce-brown/10" />
    <div className="w-1.5 h-1.5 rounded-full bg-doce-yellow" />
    <div className="w-1 h-1 rounded-full bg-doce-brown/20" />
    <div className="w-1.5 h-1.5 rounded-full bg-doce-yellow" />
    <div className="flex-1 h-px bg-doce-brown/10" />
  </div>
);

const NossaHistoria = () => {
  return (
    <div className="min-h-screen bg-doce-white">

      {/* ══════════════════════════════════════════
          1 — HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-doce-white overflow-hidden">
        {/* subtle background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-doce-brown/[0.03] hidden md:block" />

        <div className="container mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">

            {/* Text */}
            <FadeSection>
              <p className="text-doce-red text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                Nossa História
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-doce-brown leading-[1.1] mb-8">
                Mais do que doces.{" "}
                <span className="block text-doce-red mt-2">
                  Pequenos momentos
                </span>
                que transformam o dia.
              </h1>
              <p className="text-base md:text-lg text-doce-brown/65 leading-relaxed max-w-lg">
                A Doce Emergência nasceu de uma ideia simples: levar doces tradicionais, de qualidade e com identidade afetiva, a todas as pessoas que enxergam no doce um momento de conforto, celebração ou pausa no dia.
              </p>
              <div className="mt-8 flex items-center gap-2 text-doce-brown/40 text-sm">
                <ChevronRight className="w-4 h-4" />
                <span>Conheça a história</span>
              </div>
            </FadeSection>

            {/* Image */}
            <FadeSection delay={150}>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img
                    src={historiaHero}
                    alt="Doces tradicionais Doce Emergência"
                    className="w-full h-full object-cover"
                  />
                  {/* overlay tint */}
                  <div className="absolute inset-0 bg-gradient-to-tl from-doce-brown/20 to-transparent" />
                </div>
                {/* floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-doce-yellow rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3">
                  <Star className="w-4 h-4 text-doce-brown" fill="currentColor" strokeWidth={0} />
                  <span className="text-doce-brown font-bold text-sm">Doces Artesanais</span>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <Divider />
      </div>

      {/* ══════════════════════════════════════════
          2 — PROPÓSITO & SIGNIFICADO
      ══════════════════════════════════════════ */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">

          <FadeSection className="text-center mb-14">
            <p className="text-doce-red text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Propósito
            </p>
            <p className="text-xl md:text-2xl text-doce-brown/70 leading-relaxed max-w-2xl mx-auto">
              Acreditamos que o doce não é apenas produto —{" "}
              <span className="text-doce-brown font-semibold">é memória, é presente, é cuidado.</span>
            </p>
          </FadeSection>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Heart,
                label: "Memória",
                text: "O doce conecta com lembranças afetivas que ficam para sempre.",
                delay: 0,
              },
              {
                icon: Gift,
                label: "Presente",
                text: "Um gesto simples que demonstra cuidado de formas que palavras não conseguem.",
                delay: 100,
              },
              {
                icon: Coffee,
                label: "Pausa",
                text: "Um instante de leveza no meio da rotina, que recarrega e reconecta.",
                delay: 200,
              },
            ].map(({ icon: Icon, label, text, delay }) => (
              <FadeSection key={label} delay={delay}>
                <div className="group bg-doce-white border border-doce-brown/8 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-doce-red/8 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-doce-red" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-doce-brown mb-3">{label}</h3>
                  <p className="text-doce-brown/60 text-sm leading-relaxed">{text}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <Divider />
      </div>

      {/* ══════════════════════════════════════════
          3 — MISSÃO & QUALIDADE
      ══════════════════════════════════════════ */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Text — left */}
            <FadeSection>
              <p className="text-doce-red text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                Missão & Qualidade
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-doce-brown leading-tight mb-8">
                Clássicos acessíveis,<br />padrão sem concessões.
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-doce-yellow/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-doce-brown" strokeWidth={1.5} />
                  </div>
                  <p className="text-doce-brown/75 leading-relaxed">
                    Nossa missão é tornar os clássicos da confeitaria mais acessíveis, mantendo padrão, sabor e consistência.
                  </p>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-doce-yellow/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-doce-brown" strokeWidth={1.5} />
                  </div>
                  <p className="text-doce-brown/75 leading-relaxed">
                    Trabalhamos com processos organizados, ingredientes selecionados e foco total na experiência do cliente.
                  </p>
                </div>
              </div>
            </FadeSection>

            {/* Image — right */}
            <FadeSection delay={150}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
                  <img
                    src={historiaProcesso}
                    alt="Processo artesanal Doce Emergência"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-doce-brown/30 to-transparent" />
                </div>
                {/* accent block */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-doce-yellow/20 -z-10" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-doce-red/10 -z-10" />
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <Divider />
      </div>

      {/* ══════════════════════════════════════════
          4 — VISÃO FUTURA
      ══════════════════════════════════════════ */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <FadeSection>
            <div className="relative bg-doce-brown rounded-3xl px-8 md:px-16 py-14 md:py-20 text-center overflow-hidden">
              {/* decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-doce-white/[0.03] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-doce-yellow/10 translate-x-1/3 translate-y-1/3" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-doce-yellow/15 flex items-center justify-center mx-auto mb-8">
                  <Clock className="w-6 h-6 text-doce-yellow" strokeWidth={1.5} />
                </div>
                <p className="text-doce-yellow text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                  Em breve
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-doce-white leading-tight mb-6">
                  Estaremos prontos para atender<br className="hidden md:block" /> 24 horas por dia.
                </h2>
                <p className="text-doce-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                  Porque sabemos que algumas emergências não podem esperar —<br className="hidden md:block" />
                  especialmente as mais doces.
                </p>

                {/* line graphic */}
                <div className="flex items-center justify-center gap-2 mt-10">
                  <div className="h-px w-12 bg-doce-yellow/30" />
                  <div className="w-2 h-2 rounded-full bg-doce-yellow/50" />
                  <div className="h-px w-12 bg-doce-yellow/30" />
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <Divider />
      </div>

      {/* ══════════════════════════════════════════
          5 — FUNDADOR
      ══════════════════════════════════════════ */}
      <section className="py-4 md:py-8 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">

          <FadeSection className="mb-12 md:mb-16">
            <p className="text-doce-red text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Quem somos
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-doce-brown">
              Nosso Fundador
            </h2>
          </FadeSection>

          <div className="grid md:grid-cols-[300px_1fr] gap-12 md:gap-16 items-start">

            {/* Photo — left */}
            <FadeSection>
              <div className="flex flex-col items-center md:items-start">
                <div className="w-48 md:w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mb-5">
                  <img
                    src={founderPhoto}
                    alt="Elias Junior — Fundador da Doce Emergência"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-bold text-doce-brown text-base">Elias Junior</p>
                  <p className="text-doce-brown/50 text-sm mb-1">Fundador & Diretor Criativo</p>
                  <a
                    href="https://instagram.com/junioorelias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-doce-red text-sm hover:underline transition-colors"
                  >
                    @junioorelias
                  </a>
                </div>
              </div>
            </FadeSection>

            {/* Text — right */}
            <FadeSection delay={150} className="space-y-6">
              <p className="text-lg md:text-xl text-doce-brown leading-relaxed">
                A Doce Emergência é conduzida por um perfil criativo com base em design e produção audiovisual — alguém acostumado a construir marcas, organizar processos e pensar experiência do início ao fim.
              </p>
              <p className="text-base md:text-lg text-doce-brown/70 leading-relaxed">
                A ideia não começou em um escritório. Começou no contato direto com as pessoas, testando sabores, ajustando detalhes e entendendo, na prática, o que realmente encanta. Cada interação serviu como termômetro para refinar produto, comunicação e posicionamento.
              </p>

              <div className="border-l-4 border-doce-yellow pl-6 py-2">
                <p className="text-xl md:text-2xl font-bold text-doce-brown leading-snug">
                  O olhar estético virou padrão.<br />
                  A experiência virou método.
                </p>
              </div>

              <p className="text-base md:text-lg text-doce-brown/70 leading-relaxed">
                Hoje, a marca cresce com estrutura e direção clara — mantendo a mesma atenção aos detalhes que a fizeram ganhar espaço desde o primeiro dia.
              </p>
            </FadeSection>

          </div>
        </div>
      </section>

    </div>
  );
};

export default NossaHistoria;
