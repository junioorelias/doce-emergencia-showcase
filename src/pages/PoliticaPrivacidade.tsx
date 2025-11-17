const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-doce-white text-center mb-8">
            Política de Privacidade
          </h1>

          <div className="bg-doce-white rounded-2xl p-6 md:p-10 shadow-xl space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">1. Informações que Coletamos</h2>
              <p className="text-doce-brown leading-relaxed">
                Coletamos informações que você nos fornece diretamente ao fazer um pedido, incluindo nome, endereço de entrega, telefone e preferências de pagamento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">2. Como Usamos Suas Informações</h2>
              <p className="text-doce-brown leading-relaxed mb-2">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-doce-brown space-y-1 ml-4">
                <li>Processar e entregar seus pedidos</li>
                <li>Comunicar sobre o status do pedido</li>
                <li>Melhorar nossos serviços</li>
                <li>Enviar ofertas exclusivas (com seu consentimento)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">3. Compartilhamento de Informações</h2>
              <p className="text-doce-brown leading-relaxed">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar pagamentos ou realizar entregas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">4. Segurança</h2>
              <p className="text-doce-brown leading-relaxed">
                Implementamos medidas de segurança para proteger suas informações pessoais. Todos os dados sensíveis são criptografados e armazenados com segurança.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">5. Seus Direitos</h2>
              <p className="text-doce-brown leading-relaxed">
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Entre em contato conosco através do WhatsApp para exercer esses direitos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">6. Cookies</h2>
              <p className="text-doce-brown leading-relaxed">
                Utilizamos cookies apenas para melhorar sua experiência de navegação. Você pode desativar cookies nas configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-doce-brown mb-3">7. Contato</h2>
              <p className="text-doce-brown leading-relaxed">
                Para dúvidas sobre nossa política de privacidade, entre em contato pelo WhatsApp: (11) 97682-4710
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

export default PoliticaPrivacidade;
