import { useState, useRef } from 'react';

export function FormularioRifa() {
  // Controle de Etapas
  const [etapa, setEtapa] = useState(1);

  // ================= ESTADOS DA ETAPA 1 (Intactos) =================
  const [nome, setNome] = useState('');
  const [origem, setOrigem] = useState('');
  const [qtd, setQtd] = useState(0);
  const [valorEmCentavos, setValorEmCentavos] = useState(0);
  const [mostrarTabela, setMostrarTabela] = useState(false);

  // ================= ESTADOS DA ETAPA 2 (Intactos) =================
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [prazoReserva, setPrazoReserva] = useState('');
  const [minTitulos, setMinTitulos] = useState('');
  const [maxTitulos, setMaxTitulos] = useState('');
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [kwai, setKwai] = useState('');
  const [regulamento, setRegulamento] = useState('');
  
  // Editor de Foto
  const [modalRecorte, setModalRecorte] = useState(false);
  const [imagemTemp, setImagemTemp] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 220, height: 220 });
  const [dragAcao, setDragAcao] = useState<'nenhuma' | 'mover' | 'redimensionar'>('nenhuma');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startCrop, setStartCrop] = useState(crop);

  // ================= ESTADOS DA ETAPA 3 (Modo e Sorteio) =================
  const [modoTitulos, setModoTitulos] = useState<'aleatorio' | 'exposto'>('aleatorio');
  const [progressoVisivel, setProgressoVisivel] = useState(true);
  const [temDataSorteio, setTemDataSorteio] = useState<'sem_data' | 'com_data'>('sem_data');
  const [dataEfetivaSorteio, setDataEfetivaSorteio] = useState('');

  // ================= ESTADOS NOVOS: PRÊMIOS E PROMOÇÕES =================
  const [modalPremios, setModalPremios] = useState(false);
  const [premios, setPremios] = useState([{ id: 1, descricao: '' }]);

  const [modalPromocoes, setModalPromocoes] = useState(false);
  const [promocoes, setPromocoes] = useState([{ id: 1, qtd: '', valorEmCentavos: 0 }]);

  // Funções de Prêmios
  const addPremio = () => setPremios([...premios, { id: Date.now(), descricao: '' }]);
  const removePremio = (id: number) => setPremios(premios.filter(p => p.id !== id));
  const updatePremio = (id: number, val: string) => setPremios(premios.map(p => p.id === id ? { ...p, descricao: val } : p));

  // Funções de Promoções
  const addPromocao = () => setPromocoes([...promocoes, { id: Date.now(), qtd: '', valorEmCentavos: 0 }]);
  const removePromocao = (id: number) => setPromocoes(promocoes.filter(p => p.id !== id));
  const updatePromocaoQtd = (id: number, val: string) => setPromocoes(promocoes.map(p => p.id === id ? { ...p, qtd: val } : p));
  const updatePromocaoValor = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setPromocoes(promocoes.map(p => p.id === id ? { ...p, valorEmCentavos: Number(apenasNumeros) } : p));
  };


  // ================= LÓGICAS DA ETAPA 1 E 2 (Intactas) =================
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, acao: 'mover' | 'redimensionar') => {
    e.stopPropagation();
    setDragAcao(acao);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartCrop(crop);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragAcao === 'nenhuma') return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    if (dragAcao === 'mover') {
      setCrop({ ...startCrop, x: startCrop.x + dx, y: startCrop.y + dy });
    } else if (dragAcao === 'redimensionar') {
      setCrop({
        ...startCrop,
        width: Math.max(100, startCrop.width + dx),
        height: Math.max(100, startCrop.height + dy)
      });
    }
  };

  const handlePointerUp = () => setDragAcao('nenhuma');

  const valorEmReais = valorEmCentavos / 100;
  const arrecadacaoEstimada = qtd * valorEmReais;

  const getTaxa = (q: number) => {
    if (q === 0) return 0;
    if (q <= 100) return 7;
    if (q <= 250) return 17;
    if (q <= 450) return 27;
    if (q <= 750) return 37;
    if (q <= 1000) return 47;
    if (q <= 2000) return 67;
    if (q <= 4000) return 77;
    if (q <= 7000) return 97;
    if (q <= 10000) return 147;
    if (q <= 15000) return 197;
    if (q <= 20000) return 247;
    if (q <= 30000) return 347;
    if (q <= 50000) return 697;
    if (q <= 70000) return 797;
    if (q <= 100000) return 997;
    return 1497;
  };

  const taxaAtual = getTaxa(qtd);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setValorEmCentavos(Number(apenasNumeros));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImagemTemp(url);
      setCrop({ x: 50, y: 50, width: 220, height: 220 });
      setModalRecorte(true);
    }
  };

  const confirmarRecorte = () => {
    if (imageRef.current) {
      const canvas = document.createElement('canvas');
      const img = imageRef.current;
      const scaleX = img.naturalWidth / img.getBoundingClientRect().width;
      const scaleY = img.naturalHeight / img.getBoundingClientRect().height;
      const imgRect = img.getBoundingClientRect();
      const editorRect = img.parentElement!.getBoundingClientRect();
      const cropX_onImage = crop.x - (imgRect.left - editorRect.left);
      const cropY_onImage = crop.y - (imgRect.top - editorRect.top);
      const actualCropX = cropX_onImage * scaleX;
      const actualCropY = cropY_onImage * scaleY;
      const actualCropWidth = crop.width * scaleX;
      const actualCropHeight = crop.height * scaleY;
      canvas.width = actualCropWidth;
      canvas.height = actualCropHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, actualCropX, actualCropY, actualCropWidth, actualCropHeight, 0, 0, actualCropWidth, actualCropHeight);
        setFotoPreview(canvas.toDataURL('image/jpeg'));
      }
    }
    setModalRecorte(false);
    setImagemTemp(null);
  };

  const cancelarRecorte = () => {
    setModalRecorte(false);
    setImagemTemp(null);
  };

  const excluirFoto = () => setFotoPreview(null);

  const finalizarCampanha = () => {
    alert("Campanha pronta para ser enviada para o banco de dados!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#18181b] rounded-lg border border-[#27272a] text-white shadow-xl relative">
      
      {/* CABEÇALHO E INDICADOR DE ETAPAS */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#22c55e] border-2 border-[#22c55e] rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none pb-[2px]">+</span>
            Criar campanha
          </h2>
          <button 
            onClick={() => setEtapa(etapa > 1 ? etapa - 1 : 1)}
            disabled={etapa === 1}
            className={`border border-[#27272a] bg-[#09090b] px-4 py-2 rounded flex items-center gap-2 text-sm transition-colors ${etapa === 1 ? 'opacity-50 cursor-not-allowed text-zinc-600' : 'text-zinc-400 hover:text-white'}`}
          >
            <span>{'<'}</span> Voltar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${etapa >= 1 ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#27272a] text-zinc-500'}`}>1</div>
              <span className={`font-bold text-sm ${etapa >= 1 ? 'text-white' : 'text-zinc-500'}`}>Informações</span>
            </div>
            <div className={`h-1 w-full rounded-full ${etapa >= 1 ? 'bg-[#22c55e]' : 'bg-[#27272a]'}`}></div>
          </div>
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${etapa >= 2 ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#27272a] text-zinc-500'}`}>2</div>
              <span className={`font-bold text-sm ${etapa >= 2 ? 'text-white' : 'text-zinc-500'}`}>Detalhes</span>
            </div>
            <div className={`h-1 w-full rounded-full ${etapa >= 2 ? 'bg-[#22c55e]' : 'bg-[#27272a]'}`}></div>
          </div>
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${etapa >= 3 ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#27272a] text-zinc-500'}`}>3</div>
              <span className={`font-bold text-sm ${etapa >= 3 ? 'text-white' : 'text-zinc-500'}`}>Finalizar</span>
            </div>
            <div className={`h-1 w-full rounded-full ${etapa >= 3 ? 'bg-[#22c55e]' : 'bg-[#27272a]'}`}></div>
          </div>
        </div>
      </div>

      {/* ================= ETAPA 1 ================= */}
      {etapa === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Nome da campanha</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none" />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Por onde será extraído o resultado?</label>
            <select value={origem} onChange={(e) => setOrigem(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none">
              <option value="">Selecionar</option>
              <option value="federal">Loteria Federal</option>
              <option value="sorteador">Sorteador</option>
              <option value="poste">Deu no Poste</option>
              <option value="organizador">Organizador</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Quantidade de títulos</label>
            <select value={qtd} onChange={(e) => setQtd(Number(e.target.value))} className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none">
              <option value="0">Selecionar</option>
              <optgroup label="Títulos">
                <option value="25">25 títulos (00 a 24)</option>
                <option value="50">50 títulos (00 a 49)</option>
                <option value="100">100 títulos (00 a 99)</option>
                <option value="150">150 títulos (000 a 149)</option>
                <option value="200">200 títulos (000 a 199)</option>
                <option value="250">250 títulos (000 a 249)</option>
                <option value="300">300 títulos (000 a 299)</option>
                <option value="400">400 títulos (000 a 399)</option>
                <option value="500">500 títulos (000 a 499)</option>
                <option value="600">600 títulos (000 a 599)</option>
                <option value="700">700 títulos (000 a 699)</option>
                <option value="800">800 títulos (000 a 799)</option>
                <option value="900">900 títulos (000 a 899)</option>
                <option value="1000">1000 títulos (000 a 999)</option>
                <option value="1100">1100 títulos (0000 a 1099)</option>
                <option value="1500">1500 títulos (0000 a 1499)</option>
                <option value="1600">1600 títulos (0000 a 1599)</option>
                <option value="2000">2000 títulos (0000 a 1999)</option>
                <option value="2500">2500 títulos (0000 a 2499)</option>
                <option value="3000">3000 títulos (0000 a 2999)</option>
                <option value="3500">3500 títulos (0000 a 3499)</option>
                <option value="4000">4000 títulos (0000 a 3999)</option>
                <option value="4500">4500 títulos (0000 a 4499)</option>
                <option value="5000">5000 títulos (0000 a 4999)</option>
                <option value="5500">5500 títulos (0000 a 5499)</option>
                <option value="6000">6000 títulos (0000 a 5999)</option>
                <option value="7000">7000 títulos (0000 a 6999)</option>
                <option value="1000000">1.000.000 títulos (000000 a 999999)</option>
                <option value="10000000">10.000.000 títulos (0000000 a 9999999)</option>
              </optgroup>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">Valor de cada título (R$)</label>
            <input type="text" value={valorEmCentavos > 0 ? (valorEmCentavos / 100).toFixed(2).replace('.', ',') : ''} onChange={handleValorChange} className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none" placeholder="0,00" />
          </div>

          <div className="mb-6 p-4 bg-[#09090b] rounded border border-[#27272a]">
            <p className="text-sm">Arrecadação estimada: <span className="text-[#22c55e] font-bold">R$ {arrecadacaoEstimada.toFixed(2).replace('.', ',')}</span></p>
            <p className="text-sm mt-1">Taxa: <span className="font-bold">R$ {taxaAtual.toFixed(2).replace('.', ',')}</span></p>
            <button onClick={() => setMostrarTabela(true)} className="text-sm text-[#22c55e] underline mt-2 hover:opacity-80">Ver tabela de taxa →</button>
          </div>

          <button onClick={() => setEtapa(2)} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 rounded transition-colors">Criar e continuar</button>
        </div>
      )}

      {/* ================= ETAPA 2 ================= */}
      {etapa === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-1">Foto da campanha</label>
            <p className="text-xs text-zinc-400 mb-3">Adicione 1 foto para a capa da sua campanha</p>
            {fotoPreview ? (
              <div>
                <div className="w-full h-48 bg-[#09090b] border border-[#27272a] rounded-lg overflow-hidden relative flex items-center justify-center">
                  <img src={fotoPreview} alt="Preview da Campanha" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="mt-2 text-left">
                  <button onClick={excluirFoto} className="text-red-500 hover:text-red-400 text-sm font-bold transition-colors">Excluir</button>
                </div>
              </div>
            ) : (
              <label className="w-full h-48 bg-[#09090b] border-2 border-dashed border-[#27272a] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all overflow-hidden relative">
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                <span className="text-3xl mb-2 text-zinc-500">📸</span>
                <span className="text-sm text-zinc-400">Clique para selecionar a foto</span>
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Prazo da reserva</label>
            <select value={prazoReserva} onChange={(e) => setPrazoReserva(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none">
              <option value="">Selecione o prazo padrão</option>
              <option value="5m">5 minutos</option>
              <option value="10m">10 minutos</option>
              <option value="30m">30 minutos</option>
              <option value="1h">1 hora</option>
              <option value="3h">3 horas</option>
              <option value="12h">12 horas</option>
              <option value="1d">1 dia</option>
              <option value="2d">2 dias</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Quantidade mínima de títulos para ser reservado</label>
              <input type="number" value={minTitulos} onChange={(e) => setMinTitulos(e.target.value)} placeholder="Ex: 1" className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Quantidade máxima de títulos para reserva</label>
              <input type="number" value={maxTitulos} onChange={(e) => setMaxTitulos(e.target.value)} placeholder="Ilimitado" className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none" />
            </div>
          </div>

          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4">
            <label className="block text-sm font-bold text-white mb-4">Redes Sociais e Vídeo (Opcional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs text-zinc-400 mb-1">Instagram</label><input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Link do perfil" className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 focus:border-[#22c55e] outline-none text-sm" /></div>
              <div><label className="block text-xs text-zinc-400 mb-1">Facebook</label><input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Link da página ou perfil" className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 focus:border-[#22c55e] outline-none text-sm" /></div>
              <div><label className="block text-xs text-zinc-400 mb-1">TikTok</label><input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="Link do perfil" className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 focus:border-[#22c55e] outline-none text-sm" /></div>
              <div><label className="block text-xs text-zinc-400 mb-1">Kwai</label><input type="text" value={kwai} onChange={(e) => setKwai(e.target.value)} placeholder="Link do perfil" className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 focus:border-[#22c55e] outline-none text-sm" /></div>
              <div className="md:col-span-2 mt-2"><label className="block text-xs text-zinc-400 mb-1">YouTube / Vídeo de apresentação</label><input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="Link do vídeo no YouTube" className="w-full bg-[#18181b] border border-[#27272a] rounded p-2 focus:border-[#22c55e] outline-none text-sm" /></div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Regulamento (Opcional)</label>
            <textarea value={regulamento} onChange={(e) => setRegulamento(e.target.value)} rows={4} placeholder="Digite as regras ou regulamento da sua campanha aqui..." className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none resize-none"></textarea>
          </div>

          <button onClick={() => setEtapa(3)} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 rounded transition-colors mt-4">Continuar para finalizar</button>
        </div>
      )}

      {/* ================= ETAPA 3 (MODO E RESULTADO) ================= */}
      {etapa === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
          
          {/* Caixa de Modo */}
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#22c55e]">⚙️</span> Modo
            </h3>
            
            <div className="flex bg-[#18181b] rounded-md p-1 mb-6 border border-[#27272a]">
              <button onClick={() => setModoTitulos('aleatorio')} className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${modoTitulos === 'aleatorio' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Títulos Aleatórios</button>
              <button onClick={() => setModoTitulos('exposto')} className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${modoTitulos === 'exposto' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Títulos Expostos</button>
            </div>

            <div className="mb-6 text-center">
              <p className="text-sm text-zinc-400 mb-4">{modoTitulos === 'aleatorio' ? 'As cotas são selecionadas aleatoriamente pelo sistema' : 'Os participantes poderão escolher os números disponíveis'}</p>
              {modoTitulos === 'aleatorio' ? (
                <div className="flex flex-col items-center gap-2 max-w-[240px] mx-auto bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                  <div className="flex gap-2 justify-center w-full"><div className="bg-[#22c55e] text-black font-bold py-2 px-3 rounded w-full">+01</div><div className="bg-[#22c55e] text-black font-bold py-2 px-3 rounded w-full">+20</div><div className="bg-[#22c55e] text-black font-bold py-2 px-3 rounded w-full">+50</div></div>
                  <div className="flex gap-2 justify-center w-full"><div className="bg-[#22c55e] text-black font-bold py-2 px-3 rounded w-full">+100</div><div className="bg-[#22c55e] text-black font-bold py-2 px-3 rounded w-full">+300</div><div className="bg-[#22c55e] text-black font-bold py-2 px-3 rounded w-full">+500</div></div>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 max-w-[240px] mx-auto bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                  {[...Array(10)].map((_, i) => (<div key={i} className="border border-zinc-600 text-zinc-400 rounded py-1 text-xs">{(i).toString().padStart(2, '0')}</div>))}
                </div>
              )}
            </div>

            <div className="border-t border-[#27272a] pt-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400 pr-4">Deixar o progresso da campanha visível para os participantes</span>
              <div className={`w-11 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors flex-shrink-0 ${progressoVisivel ? 'bg-[#22c55e]' : 'bg-[#27272a]'}`} onClick={() => setProgressoVisivel(!progressoVisivel)}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${progressoVisivel ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          {/* Botões de Prêmios e Promoção (AGORA SÃO CLICÁVEIS) */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setModalPremios(true)}
              className="bg-[#09090b] border border-[#27272a] rounded-lg p-5 flex flex-col items-center justify-center hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all group"
            >
              <span className="text-3xl mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">🎁</span>
              <span className="text-sm font-bold text-zinc-300 group-hover:text-[#22c55e]">Adicionar prêmios</span>
            </button>
            
            <button 
              onClick={() => setModalPromocoes(true)}
              className="bg-[#09090b] border border-[#27272a] rounded-lg p-5 flex flex-col items-center justify-center hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all group"
            >
              <span className="text-3xl mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">🏷️</span>
              <span className="text-sm font-bold text-zinc-300 group-hover:text-[#22c55e]">Adicionar promoção</span>
            </button>
          </div>

          {/* Caixa de Data do Sorteio */}
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#22c55e]">📅</span> Data do sorteio
            </h3>
            
            <div className="flex bg-[#18181b] rounded-md p-1 border border-[#27272a]">
              <button onClick={() => setTemDataSorteio('com_data')} className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${temDataSorteio === 'com_data' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Já tenho data</button>
              <button onClick={() => setTemDataSorteio('sem_data')} className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${temDataSorteio === 'sem_data' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Não tenho data</button>
            </div>

            {temDataSorteio === 'com_data' && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <input type="datetime-local" value={dataEfetivaSorteio} onChange={(e) => setDataEfetivaSorteio(e.target.value)} className="w-full bg-[#18181b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-zinc-300" />
              </div>
            )}
          </div>

          <button onClick={finalizarCampanha} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-4 rounded transition-colors mt-6 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]">
            Finalizar Campanha
          </button>
        </div>
      )}

      {/* ================= MODAL EDITOR DE FOTO ================= */}
      {modalRecorte && imagemTemp && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
          <div className="bg-[#18181b] p-6 rounded-lg w-full max-w-md shadow-2xl relative border border-[#27272a]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Recortar imagem</h3>
              <button onClick={cancelarRecorte} className="text-zinc-400 hover:text-white text-2xl font-bold leading-none">&times;</button>
            </div>
            <div className="w-full h-80 bg-[#09090b] overflow-hidden flex items-center justify-center relative mb-6">
              <img ref={imageRef} src={imagemTemp} alt="Recortar" className="max-h-full max-w-full object-contain pointer-events-none" />
              <div className="absolute border-2 border-[#22c55e] cursor-move bg-black/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]" style={{ left: `${crop.x}px`, top: `${crop.y}px`, width: `${crop.width}px`, height: `${crop.height}px` }} onPointerDown={(e) => handlePointerDown(e, 'mover')}>
                <div className="absolute inset-0 pointer-events-none flex flex-col"><div className="flex-1 border-b border-dashed border-white/50 w-full"></div><div className="flex-1 border-b border-dashed border-white/50 w-full"></div><div className="flex-1 w-full"></div></div>
                <div className="absolute inset-0 pointer-events-none flex"><div className="flex-1 border-r border-dashed border-white/50 h-full"></div><div className="flex-1 border-r border-dashed border-white/50 h-full"></div><div className="flex-1 h-full"></div></div>
                <div className="absolute -bottom-3 -right-3 w-7 h-7 bg-[#22c55e] border-2 border-white rounded-full cursor-se-resize z-10 shadow-lg flex items-center justify-center" onPointerDown={(e) => handlePointerDown(e, 'redimensionar')}><span className="text-[10px] text-black">↔</span></div>
              </div>
            </div>
            <button onClick={confirmarRecorte} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 rounded transition-colors">Selecionar</button>
          </div>
        </div>
      )}

      {/* ================= MODAL TABELA DE TAXAS ================= */}
      {mostrarTabela && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#18181b] p-6 rounded-lg w-full max-w-sm border border-[#27272a] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Taxa de publicação</h3>
              <button onClick={() => setMostrarTabela(false)} className="text-zinc-400 hover:text-white">X</button>
            </div>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 100</span><span className="text-[#22c55e]">R$ 7,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 250</span><span className="text-[#22c55e]">R$ 17,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 450</span><span className="text-[#22c55e]">R$ 27,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 750</span><span className="text-[#22c55e]">R$ 37,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 1.000</span><span className="text-[#22c55e]">R$ 47,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 2.000</span><span className="text-[#22c55e]">R$ 67,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 4.000</span><span className="text-[#22c55e]">R$ 77,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 7.000</span><span className="text-[#22c55e]">R$ 97,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 10.000</span><span className="text-[#22c55e]">R$ 147,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 15.000</span><span className="text-[#22c55e]">R$ 197,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 20.000</span><span className="text-[#22c55e]">R$ 247,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 30.000</span><span className="text-[#22c55e]">R$ 347,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 50.000</span><span className="text-[#22c55e]">R$ 697,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 70.000</span><span className="text-[#22c55e]">R$ 797,00</span></div>
               <div className="flex justify-between border-b border-[#27272a] pb-1"><span className="text-zinc-400">Até 100.000</span><span className="text-[#22c55e]">R$ 997,00</span></div>
               <div className="flex justify-between pb-1"><span className="text-zinc-400">Acima de 100.000</span><span className="text-[#22c55e]">R$ 1.497,00</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ADICIONAR PRÊMIOS ================= */}
      {modalPremios && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#18181b] p-6 rounded-lg w-full max-w-md border border-[#27272a] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Adicionar prêmio</h3>
              <button onClick={() => setModalPremios(false)} className="border border-[#27272a] bg-[#09090b] px-4 py-2 rounded text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                <span>{'<'}</span> Voltar
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {premios.map((premio, index) => (
                <div key={premio.id} className="relative">
                  <label className="block text-sm text-zinc-400 mb-2">{index + 1}º prêmio</label>
                  <input 
                    type="text" 
                    value={premio.descricao} 
                    onChange={(e) => updatePremio(premio.id, e.target.value)} 
                    className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-white pr-10" 
                  />
                  {premios.length > 1 && (
                    <button onClick={() => removePremio(premio.id)} className="absolute right-3 top-10 text-zinc-500 hover:text-red-500 transition-colors">
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addPremio} className="w-full text-[#22c55e] hover:opacity-80 font-bold py-2 mb-6 flex items-center justify-center gap-2 transition-opacity">
              <span>+</span> Adicionar mais prêmios
            </button>
            <button onClick={() => setModalPremios(false)} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 rounded transition-colors">
              Aplicar prêmio
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL ADICIONAR PROMOÇÃO ================= */}
      {modalPromocoes && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#18181b] p-6 rounded-lg w-full max-w-md border border-[#27272a] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Adicionar promoção</h3>
              <button onClick={() => setModalPromocoes(false)} className="border border-[#27272a] bg-[#09090b] px-4 py-2 rounded text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                <span>{'<'}</span> Voltar
              </button>
            </div>

            <div className="space-y-6 mb-6">
              {promocoes.map((promo) => {
                // Cálculo automático: Valor Total / Quantidade
                const valorReais = promo.valorEmCentavos / 100;
                const valorCada = Number(promo.qtd) > 0 ? (valorReais / Number(promo.qtd)) : 0;
                
                return (
                  <div key={promo.id} className="relative bg-[#09090b] p-4 rounded border border-[#27272a]">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Quantidade</label>
                        <input 
                          type="number" 
                          value={promo.qtd} 
                          onChange={(e) => updatePromocaoQtd(promo.id, e.target.value)} 
                          className="w-full bg-[#18181b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Valor total</label>
                        <div className="flex">
                          <span className="bg-[#22c55e] text-black font-bold flex items-center px-3 rounded-l">R$</span>
                          <input 
                            type="text" 
                            value={promo.valorEmCentavos > 0 ? (promo.valorEmCentavos / 100).toFixed(2).replace('.', ',') : ''} 
                            onChange={(e) => updatePromocaoValor(promo.id, e)} 
                            className="w-full bg-[#18181b] border border-[#27272a] rounded-r p-3 focus:border-[#22c55e] outline-none text-white border-l-0" 
                            placeholder="0,00" 
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">Valor de cada número custará: <span className="text-[#22c55e] font-bold">R$ {valorCada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span></p>
                    
                    {promocoes.length > 1 && (
                      <div className="text-right mt-2">
                        <button onClick={() => removePromocao(promo.id)} className="text-zinc-500 hover:text-red-500 text-sm transition-colors">
                          🗑️ Excluir
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={addPromocao} className="w-full text-[#22c55e] hover:opacity-80 font-bold py-2 mb-6 flex items-center justify-center gap-2 transition-opacity">
              <span>+</span> Adicionar mais promoções
            </button>
            <button onClick={() => setModalPromocoes(false)} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 rounded transition-colors">
              Aplicar promoção
            </button>
          </div>
        </div>
      )}

    </div>
  );
}