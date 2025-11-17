const TermosUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-doce-white text-center mb-8">
            Termos de Uso
          </h1>

          <div className="bg-doce-white rounded-2xl p-6 md:p-10 shadow-xl space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">1. Aceitação dos Termos</h2>
              <p className="text-doce-brown leading-relaxed">
                Ao acessar e usar o site Doce Emergência, você concorda com estes termos de uso. Se não concordar, por favor, não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">2. Serviços Oferecidos</h2>
              <p className="text-doce-brown leading-relaxed">
                Oferecemos venda e entrega de doces e produtos relacionados. Os pedidos são realizados através do WhatsApp e estão sujeitos à disponibilidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">3. Pedidos e Pagamentos</h2>
              <p className="text-doce-brown leading-relaxed mb-2">
                Condições de pedidos:
              </p>
              <ul className="list-disc list-inside text-doce-brown space-y-1 ml-4">
                <li>Todos os pedidos devem ser confirmados via WhatsApp</li>
                <li>Preços estão sujeitos a alteração sem aviso prévio</li>
                <li>Aceitamos Pix, dinheiro e cartão na entrega</li>
                <li>Taxa de entrega pode ser aplicada conforme localização</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">4. Cancelamentos e Reembolsos</h2>
              <p className="text-doce-brown leading-relaxed">
                Cancelamentos devem ser solicitados com antecedência mínima de 2 horas. Pedidos já em preparação não podem ser cancelados. Reembolsos serão analisados caso a caso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">5. Entrega</h2>
              <p className="text-doce-brown leading-relaxed">
                Fazemos entregas em horários comerciais. O tempo estimado de entrega será informado no momento do pedido. Atrasos podem ocorrer devido a condições externas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">6. Qualidade dos Produtos</h2>
              <p className="text-doce-brown leading-relaxed">
                Nossos produtos são feitos com ingredientes frescos. Informações sobre alérgenos estão disponíveis mediante solicitação. Não nos responsabilizamos por reações alérgicas não informadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">7. Propriedade Intelectual</h2>
              <p className="text-doce-brown leading-relaxed">
                Todo conteúdo do site, incluindo textos, imagens e logo, são propriedade da Doce Emergência e protegidos por direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">8. Limitação de Responsabilidade</h2>
              <p className="text-doce-brown leading-relaxed">
                Não nos responsabilizamos por danos indiretos resultantes do uso de nossos serviços. Nossa responsabilidade está limitada ao valor do pedido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">9. Alterações nos Termos</h2>
              <p className="text-doce-brown leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. Alterações serão publicadas nesta página.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">10. Contato</h2>
              <p className="text-doce-brown leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato pelo WhatsApp: (11) 97682-4710
              </p>
            </section>

            <p className="text-doce-brown/60 text-sm mt-8 pt-6 border-t border-doce-brown/10">
              Última atualização: Janeiro de 2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermosUso;
