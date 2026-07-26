import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  // Função mágica para fazer a tela deslizar até a seção desejada
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#22c55e] selection:text-black">
      
      {/* CABEÇALHO (Navbar) - 100% alinhado com o conteúdo de baixo */}
      <header className="fixed top-0 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a]/50 z-50">
        <div className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => scrollToSection('topo')}>
            <h1 className="text-2xl font-black italic tracking-wider flex items-center gap-1">
              <span className="text-[#22c55e]">RIFA</span> 
              <span className="bg-[#22c55e] text-black px-2 rounded-md">PIX</span>
            </h1>
          </div>

          {/* Links do meio com a função de rolagem suave */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => scrollToSection('como-funciona')} className="hover:text-white transition-colors cursor-pointer">Como funciona?</button>
            <button onClick={() => scrollToSection('funcionalidades')} className="hover:text-white transition-colors cursor-pointer">Funcionalidades</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">Dúvidas frequentes</button>
          </nav>

          {/* Botão de Acessar Conta */}
          <div>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 border border-[#27272a] hover:bg-[#27272a] hover:text-[#22c55e] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              Acessar conta
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            </button>
          </div>

        </div>
      </header>

      {/* SEÇÃO PRINCIPAL (Hero) */}
      <main id="topo" className="flex flex-col items-center justify-center text-center px-4 pt-48 pb-24 max-w-4xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22c55e] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] relative z-10">
          Arrecade mais com o sistema <br className="hidden md:block" />
          <span className="text-[#22c55e]">mais seguro</span> do mercado.
        </h2>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed relative z-10">
          Conheça o Rifa Pix, a plataforma completa onde a transparência encontra a tecnologia. Crie sua campanha hoje mesmo, engaje seu público e gerencie tudo sem dor de cabeça.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-10">
          <button 
            onClick={() => navigate('/login')} 
            className="w-full sm:w-auto bg-[#22c55e] hover:bg-green-600 text-black font-bold px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 text-lg"
          >
            Comece agora
          </button>
          
          <button 
            onClick={() => scrollToSection('contato')}
            className="w-full sm:w-auto border border-[#27272a] hover:bg-[#27272a] text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            Fale conosco!
          </button>
        </div>
      </main>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-[#18181b] border-t border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#22c55e] font-bold tracking-wider uppercase text-sm">Passo a passo</span>
          <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-16">Do zero ao dinheiro na conta</h3>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-[#09090b] p-8 rounded-2xl border border-[#27272a]">
              <div className="w-12 h-12 bg-[#22c55e] text-black font-black text-xl rounded-full flex items-center justify-center mb-6">1</div>
              <h4 className="text-xl font-bold mb-3 text-white">Cadastro Expresso</h4>
              <p className="text-zinc-400 leading-relaxed">Abra sua conta em segundos. Nosso processo é 100% digital, sem burocracia e focado em colocar sua ação no ar rapidamente.</p>
            </div>
            
            <div className="bg-[#09090b] p-8 rounded-2xl border border-[#27272a]">
              <div className="w-12 h-12 bg-[#22c55e] text-black font-black text-xl rounded-full flex items-center justify-center mb-6">2</div>
              <h4 className="text-xl font-bold mb-3 text-white">Monte sua Ação</h4>
              <p className="text-zinc-400 leading-relaxed">Defina seus prêmios, quantidade de bilhetes e integre seu meio de recebimento direto no nosso painel intuitivo.</p>
            </div>

            <div className="bg-[#09090b] p-8 rounded-2xl border border-[#27272a]">
              <div className="w-12 h-12 bg-[#22c55e] text-black font-black text-xl rounded-full flex items-center justify-center mb-6">3</div>
              <h4 className="text-xl font-bold mb-3 text-white">Lance e Lucre</h4>
              <p className="text-zinc-400 leading-relaxed">Compartilhe seu link exclusivo. As baixas de pagamento são automáticas e o valor das vendas vai direto para você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-24 bg-[#09090b]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#22c55e] font-bold tracking-wider uppercase text-sm">Recursos Exclusivos</span>
          <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-16">Tecnologia que trabalha por você</h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-6 border border-[#27272a] rounded-2xl hover:border-[#22c55e] transition-colors bg-[#18181b]">
              <h4 className="text-lg font-bold text-white mb-2">⚡ Baixa Automática de Pix</h4>
              <p className="text-zinc-400 text-sm">Diga adeus à conferência manual de comprovantes. O cliente paga, o sistema reconhece e aprova o número na hora.</p>
            </div>
            <div className="p-6 border border-[#27272a] rounded-2xl hover:border-[#22c55e] transition-colors bg-[#18181b]">
              <h4 className="text-lg font-bold text-white mb-2">📊 Painel de Gestão Completo</h4>
              <p className="text-zinc-400 text-sm">Tenha controle total. Saiba exatamente quantos números foram vendidos, quem comprou e qual o seu lucro em tempo real.</p>
            </div>
            <div className="p-6 border border-[#27272a] rounded-2xl hover:border-[#22c55e] transition-colors bg-[#18181b]">
              <h4 className="text-lg font-bold text-white mb-2">📱 Design 100% Responsivo</h4>
              <p className="text-zinc-400 text-sm">Sua campanha vai abrir perfeitamente no celular, tablet ou computador, garantindo a melhor experiência para seus compradores.</p>
            </div>
            <div className="p-6 border border-[#27272a] rounded-2xl hover:border-[#22c55e] transition-colors bg-[#18181b]">
              <h4 className="text-lg font-bold text-white mb-2">🔒 Segurança e Estabilidade</h4>
              <p className="text-zinc-400 text-sm">Nossa infraestrutura garante que seu site não caia, mesmo que você tenha milhares de acessos simultâneos no dia do lançamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: DÚVIDAS FREQUENTES E CTA */}
      <section id="faq" className="py-24 bg-[#18181b] border-t border-[#27272a]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#22c55e] font-bold tracking-wider uppercase text-sm">FAQ</span>
            <h3 className="text-3xl md:text-4xl font-bold mt-2">Dúvidas Frequentes</h3>
          </div>

          <div className="space-y-6">
            <div className="border-b border-[#27272a] pb-6">
              <h4 className="text-xl font-bold text-white flex gap-4"><span className="text-[#22c55e]">01</span> Preciso de autorização para criar uma campanha?</h4>
              <p className="text-zinc-400 mt-3 pl-9">Nós fornecemos a tecnologia robusta para sua campanha. A regularização legal e o cumprimento das normativas de sorteios da sua região são de total responsabilidade do organizador.</p>
            </div>
            <div className="border-b border-[#27272a] pb-6">
              <h4 className="text-xl font-bold text-white flex gap-4"><span className="text-[#22c55e]">02</span> Para onde vai o dinheiro arrecadado?</h4>
              <p className="text-zinc-400 mt-3 pl-9">Você tem total autonomia. Os pagamentos são processados e enviados diretamente para a conta bancária ou plataforma de pagamento que você configurar no seu painel.</p>
            </div>
            <div className="border-b border-[#27272a] pb-6">
              <h4 className="text-xl font-bold text-white flex gap-4"><span className="text-[#22c55e]">03</span> O sistema faz a baixa dos números sozinho?</h4>
              <p className="text-zinc-400 mt-3 pl-9">Sim! Ao utilizar nossos métodos de pagamento automatizados (como Pix), o status do bilhete muda para "Pago" em segundos após o cliente realizar a transferência, sem você precisar mexer um dedo.</p>
            </div>
            <div className="pb-6">
              <h4 className="text-xl font-bold text-white flex gap-4"><span className="text-[#22c55e]">04</span> Posso gerenciar mais de uma rifa ao mesmo tempo?</h4>
              <p className="text-zinc-400 mt-3 pl-9">Com certeza. Não há limites. Nosso painel permite que você administre dezenas de campanhas ativas simultaneamente de forma organizada e clara.</p>
            </div>
          </div>

          {/* CTA FINAL (Bandeira de baixo) */}
          <div className="mt-20 bg-gradient-to-br from-[#22c55e] to-green-700 rounded-3xl p-10 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-black mb-4">Transforme sua audiência em lucro hoje.</h3>
            <p className="text-green-950 font-medium mb-8 max-w-xl mx-auto">Pare de perder tempo anotando números no papel. Automatize suas rifas e veja seu faturamento decolar.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-black text-white hover:bg-zinc-800 font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-lg"
            >
              Criar minha primeira campanha
            </button>
          </div>
        </div>
      </section>

      {/* 🚀 NOVA SEÇÃO: CONTATO DIRETO E TRANSPARÊNCIA */}
      <section id="contato" className="py-24 bg-[#09090b] border-t border-[#27272a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#22c55e] font-bold tracking-wider uppercase text-sm">Atendimento Direto</span>
          <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Transparência em primeiro lugar.</h3>
          
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Sabemos que segurança e confiança são fundamentais para o sucesso do seu negócio. Por isso, não nos escondemos atrás da tela. Fale diretamente com o criador da plataforma para tirar dúvidas, relatar problemas ou firmar parcerias.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            
            {/* WhatsApp */}
            <a href="https://wa.me/qr/TLWBBP4ZTN6PK1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#18181b] border border-[#27272a] hover:border-[#22c55e] p-6 rounded-2xl transition-colors text-left group cursor-pointer w-full md:w-auto">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-[#22c55e] transition-colors">
                <svg className="w-6 h-6 text-green-500 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Meu WhatsApp</p>
                <p className="text-lg font-bold text-white">(82) 98898-7121</p>
              </div>
            </a>

            {/* E-mail */}
            <a href="mailto:edson.importirlanda@hotmail.com" className="flex items-center gap-4 bg-[#18181b] border border-[#27272a] hover:border-[#22c55e] p-6 rounded-2xl transition-colors text-left group cursor-pointer w-full md:w-auto">
              <div className="w-12 h-12 bg-[#22c55e]/10 rounded-full flex items-center justify-center group-hover:bg-[#22c55e] transition-colors">
                <svg className="w-6 h-6 text-[#22c55e] group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p className="text-sm text-zinc-400">E-mail Direto</p>
                <p className="text-lg font-bold text-white">edson.importirlanda@hotmail.com</p>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* RODAPÉ SIMPLES */}
      <footer className="bg-[#09090b] border-t border-[#27272a] py-8 text-center text-zinc-500 text-sm">
        <p>&copy; 2024 Rifa Pix. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}