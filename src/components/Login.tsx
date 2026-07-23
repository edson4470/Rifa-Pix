import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export function Login() {
  const navigate = useNavigate();

  // Estados Visuais
  const [isLogin, setIsLogin] = useState(true); 
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [manterConectado, setManterConectado] = useState(false);

  // Estados de Dados
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Estados de Processamento
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  // 🚀 FUNÇÃO 1: Logar ou Cadastrar com Email e Senha
  const handleAutenticacao = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    setErro('');
    setSucessoMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // Tentar Fazer Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        
        if (error) throw error;
        
        // Se deu sucesso, manda para a tela inicial
        navigate('/'); 

      } else {
        // Tentar Cadastrar
        if (!nome) throw new Error('Por favor, preencha o seu nome completo.');
        if (senha.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');

        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: { full_name: nome }, // Guarda o nome do usuário no banco
          }
        });

        if (error) throw error;

        setSucessoMsg('Conta criada com sucesso! Você já pode fazer login.');
        setIsLogin(true); // Volta para a tela de login
        setSenha(''); // Limpa a senha por segurança
      }
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      // Traduzindo os erros mais comuns do inglês para o usuário
      if (err.message.includes('Invalid login credentials')) {
        setErro('Email ou senha incorretos.');
      } else if (err.message.includes('User already registered')) {
        setErro('Este email já está cadastrado.');
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚀 FUNÇÃO 2: Logar com o Google
  const handleGoogleLogin = async () => {
    setErro('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err: any) {
      setErro('Não foi possível conectar com o Google no momento.');
      setLoading(false);
    }
  };

  // 🚀 FUNÇÃO 3: Resetar Senha
  const handleEsqueciSenha = async () => {
    if (!email) {
      setErro('Digite seu email no campo acima para redefinir a senha.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSucessoMsg('Enviamos um link de redefinição para o seu email!');
    } catch (err: any) {
      setErro('Erro ao tentar redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 text-white font-sans">
      
      {/* CARTÃO CENTRAL */}
      <div className="bg-[#18181b] border border-[#27272a] w-full max-w-sm rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Efeito de brilho de fundo (Opcional, dá um ar mais premium) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#22c55e] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>

        {/* LOGO */}
        <div className="flex justify-center mb-8 relative z-10">
          <h1 className="text-3xl font-black italic tracking-wider flex items-center gap-1 cursor-default">
            <span className="text-[#22c55e]">RIFA</span> 
            <span className="bg-[#22c55e] text-black px-2 rounded-md">PIX</span>
          </h1>
        </div>

        {/* MENSAGENS DE ERRO OU SUCESSO */}
        {erro && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-500 text-xs font-medium animate-in fade-in zoom-in duration-300">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {erro}
          </div>
        )}
        {sucessoMsg && (
          <div className="mb-4 p-3 bg-[#22c55e]/10 border border-[#22c55e]/50 rounded-lg flex items-center gap-2 text-[#22c55e] text-xs font-medium animate-in fade-in zoom-in duration-300">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {sucessoMsg}
          </div>
        )}

        {/* BOTÃO GOOGLE */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full bg-[#27272a] hover:bg-[#3f3f46] border border-[#3f3f46] text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-colors mb-6 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isLogin ? 'Entrar com o Google' : 'Cadastrar com o Google'}
        </button>

        {/* DIVISOR ( --- ou --- ) */}
        <div className="flex items-center mb-6 relative z-10">
          <div className="flex-1 border-t border-[#27272a]"></div>
          <span className="px-3 text-xs text-zinc-500 uppercase">ou</span>
          <div className="flex-1 border-t border-[#27272a]"></div>
        </div>

        {/* FORMULÁRIO PRINCIPAL */}
        <form onSubmit={handleAutenticacao} className="space-y-4 relative z-10">
          
          {/* NOME (Só aparece se for Cadastro) */}
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs text-zinc-400 mb-1 ml-1">Nome completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg py-3 pl-10 pr-3 text-sm focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1 ml-1">Digite seu email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())} // O trim() evita espaços em branco acidentais
                placeholder="email@email.com"
                required
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg py-3 pl-10 pr-3 text-sm focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1 ml-1">{isLogin ? 'Digite sua senha' : 'Crie uma senha (mín. 6 caracteres)'}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input 
                type={mostrarSenha ? "text" : "password"} 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="********"
                required
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg py-3 pl-10 pr-10 text-sm focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] outline-none transition-all"
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                disabled={loading}
              >
                {mostrarSenha ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                )}
              </button>
            </div>
          </div>

          {/* ESQUECI MINHA SENHA (Só aparece no Login) */}
          {isLogin && (
            <div className="flex justify-end pt-1">
              <button 
                type="button"
                onClick={handleEsqueciSenha}
                disabled={loading}
                className="text-xs text-zinc-400 hover:text-white transition-colors underline decoration-[#27272a] hover:decoration-white underline-offset-4 disabled:opacity-50"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* TOGGLE PERMANECER CONECTADO */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setManterConectado(!manterConectado)}
              disabled={loading}
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${manterConectado ? 'bg-[#22c55e]' : 'bg-[#3f3f46]'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${manterConectado ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
            <span className="text-xs text-zinc-400">Permanecer conectado</span>
          </div>

          {/* BOTÃO PRINCIPAL */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 rounded-lg mt-4 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar minha conta')}
          </button>
        </form>

        {/* RODAPÉ: TROCAR ENTRE LOGIN E CADASTRO */}
        <div className="mt-8 text-center border-t border-[#27272a] pt-6 relative z-10">
          <p className="text-xs text-zinc-400">
            {isLogin ? 'Você não tem uma conta?' : 'Já possui uma conta?'}
            <br />
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErro('');
                setSucessoMsg('');
              }}
              disabled={loading}
              className="text-[#22c55e] hover:text-green-400 font-bold mt-1 uppercase tracking-wide underline decoration-[#22c55e]/30 underline-offset-4 disabled:opacity-50"
            >
              {isLogin ? 'Criar Conta' : 'Fazer Login'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}